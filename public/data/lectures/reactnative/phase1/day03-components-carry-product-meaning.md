# Day 3: State, Events & Mobile Interaction

**Duration: 4 hours | Focus: make the typed card respond, remember, and stay honest**

---

## Why this day exists

Yesterday's button can report a press, but the screen stays unchanged.

A useful mobile interaction needs memory: what the person typed, whether an action is available, and what the screen should show after the action.

The difficult part is not making values change. It is deciding which facts deserve memory and which values should be calculated from those facts.

That decision keeps the visible screen, keyboard path, and press behavior from disagreeing.

---

## The variable that changes without changing the screen

This looks like it should count presses:

```tsx
let count = 0;

function Counter() {
  return (
    <Pressable onPress={() => { count = count + 1; }}>
      <Text>Pauses: {count}</Text>
    </Pressable>
  );
}
```

The variable changes. The visible number often does not. React was not told to calculate a new description, and a plain variable outside the component is shared rather than owned by one rendered instance.

Predict before the fix: after two presses, what is the JavaScript value? What number is still likely visible? Why can those answers differ?

```text
press 1 -> variable 0 to 1 -> no requested render -> screen still 0
press 2 -> variable 1 to 2 -> no requested render -> screen still 0
```

We need memory connected to React's render cycle.

---

## The missing link is not assignment, but another calculation

The outer variable example proves that JavaScript memory and visible UI are different systems.

```text
JavaScript assignment changes a value
                 X
React is not automatically asked to call Counter again
                 X
the native Text keeps the last committed description
```

The `X` marks a missing relationship. The assignment itself succeeded. If you log `count`, it can print `1` and then `2`. The screen still shows `0` because React has not calculated or committed a replacement tree.

A second problem is ownership. A module-level variable exists once for the whole loaded module. Render two `<Counter />` instances and both handlers reach the same variable. The product probably expects two independent counters.

The tool we need must therefore provide two guarantees:

1. remember a value for one component instance;
2. request another render when that value changes.

`useState` exists for that pair.

---

## The state loop mental model

Do not picture React editing a word already on the screen. Picture a loop:

```text
current state snapshot
        |
        v
React calls component
        |
        v
component returns next UI description
        |
        v
native host commits the needed changes
        |
      event
        |
        v
setter requests next state, then the loop repeats
```

An **event** is a report that something happened, such as a valid press, a text edit, or a keyboard submission. An event handler is the function registered to respond later.

State is not a mutable variable that React watches continuously. React gives each render a snapshot, and setters request future work.

---

## Retrieve the component contract

Closed notes:

1. Why did Day 2 pass a function to `onPress` instead of calling it during render?
2. When should a component use `children` rather than adding another content-specific prop?

Repair: an event prop needs a function React Native can call later. `children` fits an open renderable region whose exact body belongs to the caller.

Today callbacks will change state. Yesterday's component boundary still matters because state needs an owner.

---

## Prediction feedback for the plain variable

After two presses, the outer JavaScript value can be `2` while the committed text still says `Pauses: 0`.

Those answers differ because the handler changed a module variable but did not request React's render loop. The host has no new description to commit.

If some unrelated event later causes a render, the screen might suddenly jump to the latest outer value. That does not repair the design. It makes the UI update depend on an unrelated render, which is harder to reason about.

Two component instances reveal the ownership failure too:

```tsx
<Counter />
<Counter />
```

With one outer `count`, pressing the first changes the value the second will also read on a later render. With state inside `Counter`, each mounted instance gets its own React-managed slot.

---

## `useState` connects memory to another render

```tsx
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Pressable onPress={() => setCount(count + 1)}>
      <Text>Pauses: {count}</Text>
    </Pressable>
  );
}
```

`useState(0)` asks React to keep one state value for this component instance, initially `0`. It returns a two-item array. Array destructuring names the current snapshot `count` and the update function `setCount`.

Calling `setCount` requests another render with a new state value. It does not edit the `count` constant already held by the running handler.

Trace one press:

```text
render 1: count is 0 -> screen description says "Pauses: 0"
press:    handler from render 1 calculates 0 + 1 and requests state 1
render 2: count is 1 -> screen description says "Pauses: 1"
commit:   native Text updates
```

> State is React-managed memory whose update requests a new render.

---

## Read `useState` character by character

```tsx
const [count, setCount] = useState(0);
```

`useState` is a React function. The `use` prefix marks it as a **Hook**, a function through which a component uses a React capability.

`(0)` passes the initial value for this component instance. React uses it when that instance first appears. It does not reset the count to zero every time the component function is called.

`useState(0)` returns a two-item array:

```text
item 0: current state snapshot
item 1: function that requests the next state
```

Array destructuring assigns local names to those positions:

```tsx
const statePair = useState(0);
const count = statePair[0];
const setCount = statePair[1];
```

The destructured form is shorter, but the longer form explains where both names come from.

`count` is a `const` because this render's snapshot does not change. A later render receives a different `count` constant. `setCount` does not mutate the existing constant.

---

## State belongs to a component position

Render two counters:

```tsx
function App() {
  return (
    <View>
      <Counter />
      <Counter />
    </View>
  );
}
```

Each `Counter` call appears at its own position in the tree, so React keeps a separate state value for each mounted instance.

```text
first Counter position  -> count slot 0
second Counter position -> count slot 0

press first
first Counter position  -> count slot 1
second Counter position -> count slot 0
```

This is why putting `useState` inside the component does not create one global count. React associates the state with the rendered instance.

Hooks must be called consistently at the top level of the component, not inside a condition that appears on some renders and disappears on others. React relies on a stable call order to reconnect each call with its state slot.

Today's components need one or two straightforward state calls. Keep them at the top of the function, before early returns or event handlers.

---

## A setter schedules work, then the handler keeps running

This log surprises beginners:

```tsx
function increment() {
  console.log('before', count);
  setCount(count + 1);
  console.log('after', count);
}
```

When the snapshot is `0`, both logs print `0`.

```text
before 0
after  0
```

The setter records a request. It does not travel backward through the running function and replace the local constant. After the handler finishes, React can calculate the next render, where `count` is `1`.

This is not a mobile delay or a slow phone. It is the snapshot model.

```quiz
{
  "prompt": "Why did changing a plain outer variable fail to update the visible count?",
  "multiple": false,
  "options": [
    {"text":"Numbers cannot appear inside `Text`.","correct":false},
    {"text":"The variable was not React-managed state and no new render was requested.","correct":true},
    {"text":"`Pressable` ignores functions.","correct":false},
    {"text":"Metro cannot bundle addition.","correct":false}
  ],
  "explanation": "The JavaScript assignment can succeed without asking React for a new screen description. A state setter connects the change to rendering."
}
```

---

## A render sees one snapshot

Now put two updates in one handler:

```tsx
onPress={() => {
  setCount(count + 1);
  setCount(count + 1);
}}
```

Predict the next visible number when `count` is `0`. Many learners expect `2`. Both lines run inside the handler created by the same render, so both read the same snapshot value `0` and request `1`.

```text
handler snapshot: count = 0
first request:  0 + 1 -> 1
second request: 0 + 1 -> 1
next render: count = 1
```

If the intention is "apply another step to the latest queued value," pass an updater function:

```tsx
onPress={() => {
  setCount(current => current + 1);
  setCount(current => current + 1);
}}
```

React queues the updater functions:

```text
start 0 -> first updater returns 1 -> second updater returns 2
```

Use `setCount(count + 1)` when the next state comes from this render's snapshot. Use the functional form when the next state depends on the latest queued value. The functional form is not a magic preference for every setter.

---

## Predict three queues before revealing them

Assume the current snapshot is `count = 5`. For each handler, write the next committed count.

```tsx
// A
setCount(count + 1);
setCount(count + 1);

// B
setCount(current => current + 1);
setCount(current => current + 1);

// C
setCount(count + 1);
setCount(current => current * 2);
```

Do not run them yet. For each line, state whether React received a replacement value or an updater function.

---

## Queue feedback: values replace, updaters calculate

The results are:

```text
A: next count = 6
B: next count = 7
C: next count = 12
```

For A, both lines calculate from the same snapshot `5` before passing values. React receives "replace with 6" twice.

For B, React receives two functions. It feeds the queued value through them in order:

```text
start 5 -> +1 gives 6 -> +1 gives 7
```

For C, the value request first replaces the queued result with `6`. The updater then receives `6` and returns `12`.

The point is not to write clever mixed queues. It is to predict real code. If the next value depends on the latest queued value, the updater form states that relationship honestly.

React commonly processes the event's queued state requests together before committing the next screen. This **batching** prevents the user from seeing every intermediate request as a separate half-finished screen.

---

## The handler belongs to the render that created it

Each render creates new functions that close over that render's props and state values.

```text
render 1 creates handler H1 with count = 0
press invokes H1
H1 requests count = 1
render 2 creates handler H2 with count = 1
next press invokes H2
```

This explains why H1 cannot suddenly see render 2's `count`. It was created while `count` was `0`.

Closures are ordinary JavaScript behavior. React's role is to call the component again and connect the next render to the updated state slot.

---

## Event handlers receive event information

`onPress={() => setCount(count + 1)}` ignores the press event because the update needs no event fields. React Native can also pass a press event:

```tsx
<Pressable
  onPress={event => {
    console.log(event.nativeEvent.pageX, event.nativeEvent.pageY);
    setCount(current => current + 1);
  }}
>
  <Text>Count this pause</Text>
</Pressable>
```

The parameter is the event object. `nativeEvent` contains platform event information normalized for React Native. `pageX` and `pageY` identify press coordinates in the root view's coordinate space.

Do not store the entire event object merely because it exists. Store product facts the next render needs. A touch coordinate used only for a log can remain inside the handler.

---

## `onPress` reports an accepted mobile interaction

A browser tutorial may talk about `onClick`. A touch screen has no mouse requirement, and a finger gesture has a beginning, movement, and end. React Native's `Pressable` turns the accepted sequence into higher-level press callbacks.

For today's simple action, `onPress` is the product event you care about:

```text
finger begins on the surface
  -> transient `pressed` feedback can appear

gesture remains a valid press and ends
  -> onPress runs once

state setter requests the next product state
  -> React renders and native UI commits
```

Do not treat the style function's `pressed` Boolean as a saved completion flag. It becomes false when the gesture ends. If "completed" must still be visible ten seconds later, store a product fact in state.

---

## Store the meaning, not the whole event report

Suppose the product needs to remember where a marker was placed. Coordinates may then be product data:

```tsx
type Point = { x: number; y: number };

const [lastPoint, setLastPoint] = useState<Point | null>(null);

<Pressable
  onPress={event => {
    setLastPoint({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    });
  }}
>
  <Text>Place marker</Text>
</Pressable>
```

This stores a small, explicit fact. Storing the entire event would also preserve unrelated runtime details and make the state contract unclear.

Today's Pocket Pause action does not use location at all, so its handler needs no parameter:

```tsx
onPress={() => setCount(current => current + 1)}
```

The event object is available, not mandatory. Ask what the next render actually needs.

```quiz
{
  "prompt": "Two queued increments must build on one another. Which update expresses that requirement?",
  "multiple": false,
  "options": [
    {"text":"Assign to the `count` constant.","correct":false},
    {"text":"Call `setCount(count + 1)` twice from the same snapshot.","correct":false},
    {"text":"Store the press event as the count.","correct":false},
    {"text":"Call `setCount(current => current + 1)` for each queued increment.","correct":true}
  ],
  "explanation": "Each updater receives the latest queued value, so the second increment starts from the first result."
}
```

---

## The uncontrolled note fails the screen's decision

Pocket Pause now asks for a short note and enables "Save pause" only when the trimmed note is non-empty.

An input with no state can accept typing:

```tsx
<TextInput placeholder="What do you notice?" />
```

But the component has no current value to inspect, display elsewhere, clear after saving, or use for the disabled decision. The native input owns what is visible while the React component remains unaware.

The product requirement creates the need for a **controlled input**: React state is the source of truth for the value.

---

## The uncontrolled attempt works before it breaks

Do not dismiss the first `TextInput`. It works for a narrower requirement: let a person type and see characters inside the native field.

```tsx
<TextInput placeholder="What do you notice?" />
```

The native input keeps its current text internally. That is enough until another part of the product needs the same fact.

Now add a preview:

```tsx
<Text>Your note: ???</Text>
```

There is no component value to place where `???` sits. Add a Save action that must reject spaces-only input, and there is still no component value to trim. Add a Clear action, and the component has no declared value to replace.

The uncontrolled input was not foolish. The requirement grew beyond what it exposes.

```text
native field knows the text
component needs the text for preview, validation, save, and clear
```

The fix is to move ownership of the current string into React state and make the field display that state.

---

## Control the text value

```tsx
const [note, setNote] = useState('');

<TextInput
  value={note}
  onChangeText={setNote}
  placeholder="What do you notice?"
/>
```

`note` begins as the empty string. `value={note}` tells the native input what text to display. `onChangeText` receives the next string after editing. Passing `setNote` is valid because its input matches what the callback supplies.

Trace typing `calm`:

```text
native input reports "c"    -> setNote("c")    -> render value="c"
native input reports "ca"   -> setNote("ca")   -> render value="ca"
native input reports "calm" -> setNote("calm") -> render value="calm"
```

The loop is intentional. It lets one state value drive the input, a preview, validation, and clearing.

If you write `onChangeText={setNote()}`, you call the setter while rendering and pass the wrong value as the callback. Event props receive functions, just as on Day 2.

---

## `onChangeText` is already the convenient string callback

For the ordinary text-editing path, React Native gives `onChangeText` the next string directly:

```tsx
onChangeText={nextText => setNote(nextText)}
```

Because `setNote` already accepts that next string, the wrapper can disappear:

```tsx
onChangeText={setNote}
```

Both versions express the same flow. The shorter form is appropriate when you do not need another step.

Do not carry over a browser form assumption such as reading `event.target.value`. This callback's contract is the string itself.

Predict the trace for deleting the last character:

```text
field currently shows "a"
native input reports ?
setNote receives ?
next render passes value=?
```

The three blanks are the empty string `""`. Empty text is still a real controlled value. It is not the same as the prop being absent.

---

## Controlled means one round trip for every edit

The input is not waiting for React to approve a batch of typing at the end. Each edit participates in the loop:

```text
native edit -> next string callback -> state request -> render -> value prop
```

If the displayed field refuses to change, inspect both sides of that loop. A frequent failure is:

```tsx
<TextInput value={note} onChangeText={() => {}} />
```

The native field reports edits, but the empty handler never updates `note`. The next render keeps passing the old value, so the field appears locked.

Another failure is updating one state value while `value` reads another:

```tsx
const [note, setNote] = useState('');
const [draft, setDraft] = useState('');

<TextInput value={note} onChangeText={setDraft} />
```

Typing changes `draft`; the field displays `note`. The two halves of the loop do not meet.

> In a controlled input, `value` and the change callback must agree on the same source of truth.

---

## Mobile keyboards are part of the interaction

On a phone, focusing `TextInput` opens a software keyboard that occupies screen space. A layout that looks fine before focus can hide the action afterward.

Today, make the input easy to complete and test the real keyboard:

```tsx
<TextInput
  value={note}
  onChangeText={setNote}
  placeholder="What do you notice?"
  returnKeyType="done"
  onSubmitEditing={savePause}
  blurOnSubmit
/>
```

`returnKeyType="done"` asks for an appropriate key label where supported. `onSubmitEditing` receives a function to run when the user submits from the keyboard. `blurOnSubmit` asks the input to lose focus after that submission, which dismisses the software keyboard in the usual single-line case.

Platform keyboards can differ. Test the action while the keyboard is open on the actual device. Day 10 treats avoidance, focus, autofill, and form behavior in depth. Today's boundary is to avoid treating the keyboard as an external accessory that cannot cover UI.

---

## Keyboard submit is a second route to the same product action

The visible `Pressable` and the keyboard's submit key can both call `savePause`:

```text
tap Save -------------------+
                             +-> savePause -> enforce the same rule
keyboard submit ------------+
```

That is why the save function itself checks whether the current note is valid. Disabling the `Pressable` blocks that surface. It does not rewrite every other callback in the component.

The software keyboard also changes the physical situation. It occupies part of the screen. Test these steps on a phone:

1. focus the field and confirm the keyboard appears;
2. type enough text to enable saving;
3. submit from the keyboard;
4. confirm focus leaves the single-line field and the result is visible;
5. repeat by tapping the visible action while the keyboard is open.

Day 10 owns comprehensive keyboard avoidance and focus behavior. Today's repair is smaller: include the keyboard in the interaction trace and avoid claiming a desktop preview proves it.

---

## Derive availability instead of storing it

The tempting design stores both the note and whether save is disabled:

```tsx
const [note, setNote] = useState('');
const [disabled, setDisabled] = useState(true);
```

It works if every note change also updates `disabled`. Then a future clear action calls only `setNote('')`. The note is empty while `disabled` can remain false. Two pieces of state describe one fact and can disagree.

Calculate the value during render:

```tsx
const trimmedNote = note.trim();
const isSaveDisabled = trimmedNote.length === 0;
```

`trim()` returns a string without surrounding whitespace. It does not change `note`. The Boolean expression is true exactly when no non-space content exists.

```text
note = "  calm  " -> trimmedNote = "calm" -> disabled = false
note = "     "    -> trimmedNote = ""     -> disabled = true
```

> If a value can be calculated from current props or state, calculate it instead of storing a second copy.

The counterexample is genuine independent information. Whether a server accepted a save is not derivable from the note text, so that result could deserve its own state in a later network lesson.

---

## Make the duplicate-state bug happen

Suppose the code tries to maintain the two values manually:

```tsx
const [note, setNote] = useState('');
const [disabled, setDisabled] = useState(true);

function handleChange(nextNote: string) {
  setNote(nextNote);
  setDisabled(nextNote.trim().length === 0);
}

function clearNote() {
  setNote('');
}
```

Typing works because `handleChange` updates both copies. Clearing breaks them because `clearNote` changes only one:

```text
before clear: note="calm" disabled=false
after clear:  note=""     disabled=false  <- contradiction
```

The obvious patch is `setDisabled(true)` inside `clearNote`. It repairs this path and leaves the design waiting for the next path you forget.

The derived version has no synchronization work to forget:

```tsx
const disabled = note.trim().length === 0;
```

Whenever React calculates a description with `note === ''`, the expression produces `true`. There is no older disabled value left over from another render.

This is the same shape as a receipt total:

```text
source facts: item prices and quantities
derived value: total
```

Store the facts that can change independently. Calculate their current consequence.

```quiz
{
  "prompt": "Why calculate `isSaveDisabled` from `note.trim()` instead of storing both values?",
  "multiple": false,
  "options": [
    {"text":"React Native forbids Boolean state.","correct":false},
    {"text":"Derived values render only on web.","correct":false},
    {"text":"A second copy can drift away from the note that determines it.","correct":true},
    {"text":"`trim()` permanently edits the input state.","correct":false}
  ],
  "explanation": "The disabled condition is fully determined by current note text. Calculating it removes a synchronization failure."
}
```

---

## Disabled must change behavior and meaning

Changing a button to gray is not enough. The action must stop accepting a press, and its semantics must expose the disabled state.

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityState={{ disabled: isSaveDisabled }}
  disabled={isSaveDisabled}
  onPress={savePause}
  style={({ pressed }) => [
    styles.button,
    isSaveDisabled && styles.buttonDisabled,
    pressed && !isSaveDisabled && styles.buttonPressed,
  ]}
>
  <Text style={styles.buttonText}>Save pause</Text>
</Pressable>
```

`disabled` prevents the normal press interaction. `accessibilityState` communicates the same product state to assistive technology. The style reflects it visually. These three outputs agree because they share one derived Boolean.

The action still needs a guard if it can be called from another path, such as keyboard submission:

```tsx
function savePause() {
  if (isSaveDisabled) return;
  setSavedNote(trimmedNote);
  setNote('');
}
```

The guard protects the product rule independent of which event invoked the function.

---

## A mobile action needs enough usable space

The visible word "Save pause" may be short, but a finger is not a mouse pointer. A tiny text-sized target forces precision the person may not have while moving, holding the phone one-handed, or using a mobility aid.

Today's style gives the action a minimum height:

```tsx
button: {
  minHeight: 48,
  alignItems: 'center',
  justifyContent: 'center',
}
```

`minHeight` means the surface may grow taller when content or text size needs more room, but it should not collapse below that floor. The centering properties position the label inside the surface.

Do not infer success from the green rectangle alone. Test by touching near the visible edges, with larger text enabled, and with the keyboard open. A target can look generous in a screenshot and still be partly covered or squeezed in the real interaction.

Day 6 develops layout and Day 33 performs the full accessibility audit. Today establishes the product habit: interaction size is part of behavior, not decoration.

---

## Disabled is one fact with three consumers

The same `isSaveDisabled` Boolean drives:

```text
behavior      disabled={isSaveDisabled}
semantics     accessibilityState={{ disabled: isSaveDisabled }}
appearance    isSaveDisabled && styles.buttonDisabled
```

Why all three?

- Behavior prevents the normal press callback.
- Semantics lets assistive technology announce that the action is unavailable.
- Appearance gives sighted users a cue before they try it.

If only appearance changes, the action can still fire. If only behavior changes, some users receive no explanation for why nothing happens. If only semantics change, a sighted user may still see an action that looks available.

One product fact should produce a consistent result across all three channels.

A **screen reader** is assistive software that speaks the accessible names, roles, values, and states exposed by the native interface. It reads the semantic control information, not the visual color of the button.

The guard inside `savePause` is a fourth line of defense for alternate invocation routes. It enforces the domain rule where the work occurs.

---

## One fact needs one owner

Suppose both the form and a preview component store their own copy of the note. Typing updates the form, but the preview can lag. Passing the value down keeps one owner:

```tsx
type PreviewProps = { note: string };

function Preview({ note }: PreviewProps) {
  return <Text>{note || 'Your note will appear here.'}</Text>;
}

function PauseComposer() {
  const [note, setNote] = useState('');
  return (
    <View>
      <TextInput value={note} onChangeText={setNote} />
      <Preview note={note} />
    </View>
  );
}
```

`PauseComposer` is the nearest component that needs to coordinate editing and preview. It owns the state. `Preview` receives a prop and renders it.

State does not always belong at the top of the app. Lift it only to the nearest common owner that needs to coordinate the fact. Higher ownership creates more dependencies; lower ownership prevents coordination.

---

## Watch two owners drift

This tempting split gives each child local memory:

```tsx
function Editor() {
  const [note, setNote] = useState('');
  return <TextInput value={note} onChangeText={setNote} />;
}

function Preview() {
  const [note] = useState('');
  return <Text>{note}</Text>;
}
```

Both variables are named `note`, but names do not connect state slots. Typing in `Editor` updates only `Editor`'s state. `Preview` owns a different empty string forever.

Moving state to `App` would make sharing possible, but it may be unnecessarily high if only `PauseComposer` coordinates the two. The nearest common owner is the smallest component that needs to send the same fact to both branches.

```text
PauseComposer owns note
  ├── TextInput receives note and setter path
  └── Preview receives note
```

This is **lifting state up**: move one state value from a child to the nearest ancestor that must coordinate it. It is not a command to move all state to the root.

Changed-task test: if a sibling character counter also needs the note, the same owner can derive `note.length` and pass the result down. No global store and no second copy are required.

---

## Build the complete interaction

This `App.tsx` uses only tools introduced across Days 1 to 3:

```tsx
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const trimmedNote = note.trim();
  const isSaveDisabled = trimmedNote.length === 0;

  function savePause() {
    if (isSaveDisabled) return;
    setSavedNote(trimmedNote);
    setNote('');
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Pocket Pause</Text>
      <Text style={styles.label}>What do you notice?</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        onSubmitEditing={savePause}
        returnKeyType="done"
        blurOnSubmit
        placeholder="A sound, color, or feeling"
        accessibilityLabel="What do you notice?"
        style={styles.input}
      />
      <Text style={styles.preview}>{note || 'Your note will appear here.'}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isSaveDisabled }}
        disabled={isSaveDisabled}
        onPress={savePause}
        style={({ pressed }) => [styles.button, isSaveDisabled && styles.disabled, pressed && !isSaveDisabled && styles.pressed]}
      >
        <Text style={styles.buttonText}>Save pause</Text>
      </Pressable>
      <View style={styles.result}>
        <Text style={styles.label}>Last saved pause</Text>
        <Text>{savedNote ?? 'Nothing saved yet.'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, gap: 14, padding: 24, paddingTop: 56, backgroundColor: '#eef6f2' },
  heading: { fontSize: 30, fontWeight: '700', color: '#17352b' },
  label: { fontSize: 16, fontWeight: '700', color: '#17352b' },
  input: { minHeight: 52, paddingHorizontal: 14, borderWidth: 1, borderColor: '#7a9b8f', borderRadius: 12, backgroundColor: '#fff' },
  preview: { minHeight: 24, color: '#48675c' },
  button: { minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#2f6654' },
  disabled: { backgroundColor: '#9aaba5' },
  pressed: { opacity: 0.7 },
  buttonText: { color: '#fff', fontWeight: '700' },
  result: { gap: 6, padding: 16, borderRadius: 12, backgroundColor: '#fff' },
});
```

`string | null` means `savedNote` can hold either a string or the deliberate absence value `null`. `??` chooses the fallback only when the left side is `null` or `undefined`. An empty string is not saved because the guard rejects it.

`keyboardShouldPersistTaps="handled"` lets taps handled by children, such as the save action, reach them while the keyboard is open. Test this behavior on the device rather than trusting the prop name as proof.

The visible label explains the field to sighted users. `accessibilityLabel` gives the input an explicit accessible name instead of relying on the placeholder, which disappears once text is entered. This is not browser `<label for="...">` behavior. React Native uses its own accessibility props on the native control.

---

## Separate source state, derived values, and event-only values

The completed component contains three categories. Naming them makes future decisions easier.

**Source state** can change independently and must survive into a later render:

```text
note
savedNote
```

**Derived values** are recalculated from the current source state:

```text
trimmedNote
isSaveDisabled
preview fallback choice
```

**Event-only values** are useful while a handler runs and need not be remembered:

```text
the press coordinates when only logging them
the next string before it is handed to setNote
```

Storing every temporary input creates state with no product lifetime. Failing to store an independent fact loses it between renders. Storing a derived consequence creates copies that can disagree.

Use the three-way classification before adding `useState`:

```text
Must it survive, and can it change independently? -> source state
Can current props/state calculate it completely?  -> derive it
Is it needed only during this callback?            -> local event value
```

---

## Trace the realistic path

Predict each row before running it:

```text
launch
  note="" savedNote=null disabled=true
  input empty, button disabled, result says "Nothing saved yet."

type "  blue cup  "
  note="  blue cup  " trimmedNote="blue cup" disabled=false
  preview keeps typed spacing, button enabled

press Save
  savedNote="blue cup", note=""
  input clears, button disables, result shows "blue cup"

submit spaces from keyboard
  guard returns
  savedNote stays "blue cup"
```

This trace distinguishes source state, derived values, and visible results. If the app disagrees, log those three values before changing styles.

```quiz
{
  "prompt": "After saving `  blue cup  `, why can the result show `blue cup` while the input becomes empty?",
  "multiple": false,
  "options": [
    {"text":"One handler stores the trimmed value in `savedNote` and clears `note`.","correct":true},
    {"text":"`trim()` mutates both state variables automatically.","correct":false},
    {"text":"The keyboard stores a second invisible form.","correct":false},
    {"text":"Fast Refresh duplicates the text.","correct":false}
  ],
  "explanation": "The handler makes two explicit state requests with different values. The next render reflects both."
}
```

---

## Debug the interaction in a fixed order

When a press seems ignored:

```text
1. Is `disabled` true? Log the derived reason.
2. Does the handler log when the button is enabled?
3. Does the handler request the expected state values?
4. Does the next render receive those values?
5. Is the correct state rendered in the correct `Text` or `TextInput`?
```

When typing seems wrong:

```text
1. Log the string received by `onChangeText`.
2. Confirm `value` reads from the same state.
3. Check whether another handler clears it.
4. Reproduce with the software keyboard open.
```

Do not start by adding more state. Extra copies often hide the ownership problem that caused the bug.

---

## Practice: change the requirement

Keep the feedback screen closed until you have made each prediction. Run these on a device with the software keyboard, not only in a browser window.

### Tier 1: trace snapshots on paper

Start at `count = 2`. Predict the next committed count for each handler:

```tsx
// handler A
setCount(count + 1);
setCount(count + 1);

// handler B
setCount(current => current + 1);
setCount(current => current + 1);

// handler C
setCount(10);
setCount(current => current - 3);
```

For each, identify the render snapshot seen by the handler and the queued operations React receives.

### Tier 2: prove every composer state

Run the full composer and record the values of `note`, `trimmedNote`, `isSaveDisabled`, and `savedNote` for:

1. fresh launch;
2. spaces only;
3. `"  blue cup  "` typed;
4. valid press;
5. cleared input after save;
6. keyboard submit while spaces-only.

Check behavior, semantics, and appearance for the disabled state. Use a screen reader if available and record the limitation if it is not.

---

### Tier 3: reconstruct the critical path

Close the lecture. Rebuild only:

- the two source-state declarations;
- `trimmedNote` and `isSaveDisabled`;
- the controlled `TextInput` loop;
- the guarded `savePause` function;
- the `Pressable` behavior, semantic state, and feedback styles.

Run before comparing. A type-clean file is not enough. Prove typing, keyboard submit, press submit, and clearing.

---

### Tier 4: diagnose three deliberate bugs

Introduce each bug separately and restore the correct version before moving on:

1. make `onChangeText` update `draft` while `value` reads `note`;
2. store `disabled` separately and forget to update it in `clearNote`;
3. remove the guard from `savePause`, keep the `Pressable` disabled, and submit spaces from the keyboard.

For each bug, write the first observable symptom, the two values that disagree, and the smallest repair that removes the contradictory source of truth.

---

### Tier 5: changed-task transfer

Build a "hydration check" with a controlled note and a completed-glasses count. Saving is available only when trimmed text exists and the count is below three.

Requirements:

- store only the note, saved note, and count if each can change independently;
- derive the availability rule from the current note and count;
- support a press action and keyboard submission through one guarded function;
- show pressed feedback only during the gesture;
- expose disabled semantics and keep the action at least 48 points high;
- place the editor and a sibling summary under their nearest common state owner.

Do not use routing, Effects, persistence, global state, or device APIs. The changed problem must be solved with Days 1 to 3 only.

Record **with help**, **independent once**, **recalled after a delay**, and **transferred** separately.

---

## Practice feedback: expected mechanisms

The snapshot results are:

```text
A: 3   both value requests calculate 2 + 1
B: 4   updater queue runs 2 -> 3 -> 4
C: 7   replace with 10, then updater receives 10 and returns 7
```

For the composer, spaces-only input produces `trimmedNote === ''` and keeps saving disabled. A valid save stores the trimmed string in `savedNote` and clears `note`. The next render derives disabled as true from the now-empty note.

The three deliberate failures diagnose different broken relationships:

```text
value reads note, change writes draft
  -> controlled loop is split across two owners

note clears, stored disabled stays false
  -> a derived consequence was duplicated as state

button disabled, keyboard still calls unguarded save
  -> one interaction surface was mistaken for the product rule
```

The transfer's minimal availability expression can be:

```tsx
const isSaveDisabled = note.trim().length === 0 || count >= 3;
```

That expression is not state. It is the current consequence of two source facts. A strong solution can explain why changing either fact produces the right availability on the next render without a second setter.

---

## Review queue

1. Trace two direct snapshot updates versus two functional updates.
2. Given three displayed values, decide which are source state and which are derived.

Review after roughly 1, 3, 7, 14, and 30 days. Prioritize repeated errors and keep the daily queue near 15 to 20 minutes.

---

## Common mistakes

| Symptom | Cause | Repair |
|---|---|---|
| variable changes, screen does not | mutation is outside React state | use a state setter |
| two increments produce one | both read one render snapshot | use functional updates when queuing from prior value |
| preview and input disagree | two owners copied one fact | keep one owner and pass a prop |
| spaces enable Save | raw length used instead of product meaning | derive from `trim()` |
| gray button still acts elsewhere | appearance was mistaken for a rule | disable semantics and guard the action |
| keyboard hides the path | desktop-sized assumption | test focused input and submission on device |

---

## Cheat sheet

```text
useState(initial)      current snapshot + setter
setter(next)           requests next state and render
setter(current => ...) builds on latest queued value
TextInput value        displayed controlled value
onChangeText           receives next string
derived value          calculate from current props/state
state owner            nearest component coordinating the fact
disabled interaction   behavior + semantics + visual feedback
```

---

## Tomorrow

Today's screen behaves correctly in one simple environment. Phones add cutouts, system bars, platform differences, and device-only failures.

Tomorrow you will stop treating "works on my screen" as proof and learn to separate shared product behavior from platform-specific layout and debugging evidence.

```finalquiz
{
  "title": "Day 3: State, Events & Mobile Interaction",
  "questions": [
    {"id":"q1","type":"single_correct","prompt":"Why does changing a plain outer variable not reliably update the screen?","codeSnippet":null,"options":[{"id":"a","text":"Numbers are not renderable"},{"id":"b","text":"Press events are web-only"},{"id":"c","text":"TypeScript freezes all variables"},{"id":"d","text":"The change does not request a React render"}],"correctOptionIds":["d"],"explanation":"React-managed state connects memory changes to another render.","example":"A state setter requests a new component calculation."},
    {"id":"q2","type":"single_correct","prompt":"Two direct `setCount(count + 1)` calls run in one handler where `count` is 0. What value do both request?","codeSnippet":null,"options":[{"id":"a","text":"1"},{"id":"b","text":"0"},{"id":"c","text":"2"},{"id":"d","text":"An event object"}],"correctOptionIds":["a"],"explanation":"Both lines read the same render snapshot, 0, and calculate 1.","example":"Use updater functions when queued changes must build on each other."},
    {"id":"q3","type":"multiple_correct","prompt":"Which statements describe a controlled `TextInput`?","codeSnippet":null,"options":[{"id":"a","text":"Its `value` comes from React state"},{"id":"b","text":"`onChangeText` can update that state"},{"id":"c","text":"The component can clear it by changing state"},{"id":"d","text":"The native input is the only source of truth"}],"correctOptionIds":["a","b","c"],"explanation":"State drives the value, changes feed state, and state can clear it. The native input is not the sole owner.","example":"`value={note}` and `onChangeText={setNote}` close the loop."},
    {"id":"q4","type":"single_correct","prompt":"Why derive `isSaveDisabled` from `note.trim()`?","codeSnippet":null,"options":[{"id":"a","text":"To create a second editable copy"},{"id":"b","text":"To avoid rendering the input"},{"id":"c","text":"To store whitespace permanently"},{"id":"d","text":"To keep one source fact and prevent synchronization drift"}],"correctOptionIds":["d"],"explanation":"The disabled condition is determined by note content, so a second state value can disagree needlessly.","example":"Clearing `note` automatically makes the derived condition true."},
    {"id":"q5","type":"single_correct","prompt":"Where should note state live when both an editor and preview need it?","codeSnippet":null,"options":[{"id":"a","text":"In both children independently"},{"id":"b","text":"In the nearest common component coordinating both"},{"id":"c","text":"In a module-level variable"},{"id":"d","text":"Inside Metro"}],"correctOptionIds":["b"],"explanation":"One common owner passes the current fact to both dependents.","example":"`PauseComposer` owns `note` and passes it to `Preview`."},
    {"id":"q6","type":"multiple_correct","prompt":"A disabled save action should communicate through which channels?","codeSnippet":null,"options":[{"id":"a","text":"Prevented press behavior"},{"id":"b","text":"Accessible disabled state"},{"id":"c","text":"Visual feedback"},{"id":"d","text":"A second unrelated note copy"}],"correctOptionIds":["a","b","c"],"explanation":"Behavior, semantics, and appearance should express the same derived state.","example":"Use `disabled`, `accessibilityState`, and a disabled style from one Boolean."},
    {"id":"q7","type":"single_correct","prompt":"Why keep a guard inside `savePause` when the button is disabled?","codeSnippet":null,"options":[{"id":"a","text":"Disabled buttons always press twice"},{"id":"b","text":"Guards persist data"},{"id":"c","text":"It makes `trim()` mutate state"},{"id":"d","text":"The function may also be invoked by keyboard submission"}],"correctOptionIds":["d"],"explanation":"The product rule belongs in the action too because more than one event path can call it.","example":"`onSubmitEditing` and `onPress` can share `savePause`."},
    {"id":"q8","type":"single_correct","prompt":"What does `onChangeText={setNote}` pass to the setter?","codeSnippet":null,"options":[{"id":"a","text":"A DOM input element"},{"id":"b","text":"The previous component tree"},{"id":"c","text":"The next text string"},{"id":"d","text":"The keyboard height"}],"correctOptionIds":["c"],"explanation":"React Native's text callback supplies the next string, which matches the setter input.","example":"Typing `ca` requests note state `ca`."},
    {"id":"q9","type":"multiple_correct","prompt":"Which observations are useful first when a press appears to be ignored?","codeSnippet":null,"options":[{"id":"a","text":"Whether the action is currently derived as disabled"},{"id":"b","text":"Whether the registered handler runs"},{"id":"c","text":"Whether the button color matches a website"},{"id":"d","text":"Whether the project contains a browser `div`"}],"correctOptionIds":["a","b"],"explanation":"First check whether the product rule disables the action and whether the event reaches the handler. Website color and browser tags do not trace this native interaction.","example":"Log the derived disabled reason, then log at the first line of the handler."},
    {"id":"q10","type":"single_correct","prompt":"A hydration check disables Save when the trimmed note is empty or count reaches three. What should be stored?","codeSnippet":null,"options":[{"id":"a","text":"Note, count, and a separately edited disabled flag"},{"id":"b","text":"Only the disabled flag"},{"id":"c","text":"One state copy in every child"},{"id":"d","text":"Note and count, with disabled derived from both"}],"correctOptionIds":["d"],"explanation":"Note and count are source facts. Availability is their current consequence.","example":"Derive `note.trim().length === 0 || count >= 3`."}
  ]
}
```
