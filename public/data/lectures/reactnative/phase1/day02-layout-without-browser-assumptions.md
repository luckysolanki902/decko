# Day 2: Core Components, Props & Typed Composition

**Duration: 4 hours | Focus: turn native primitives into a reusable typed content card**

---

## Why this day exists

Yesterday's screen had one fixed message. A real app repeats shapes while changing their content.

Copying the whole shape works for the second item. Then one copy gets a fix, another keeps the bug, and the screen stops feeling like one product.

Today you will give that repeated idea one name and a clear set of inputs.

The result should stay understandable when the content changes, the text grows, or the image is absent.

---

## The copy that works until it changes

This is a reasonable two-card screen:

```tsx
<View>
  <View><Text>Morning walk</Text><Text>10 minutes</Text></View>
  <View><Text>Drink water</Text><Text>One glass</Text></View>
</View>
```

It renders. Then the product asks for an optional image, a details area, and one action on every card. You can paste each addition twice. With ten cards, every correction becomes ten edits.

Predict the failure: if the first card gets a better accessibility label and the second copy does not, will the screen look broken? Will it still be broken for someone using an assistive technology?

The visual screenshot can pass while the product contract has drifted.

---

## Retrieve yesterday's path

Closed notes:

1. Why must visible strings sit inside `Text` rather than directly inside `View`?
2. Place these in order: native host, Metro, React description, Hermes.

Write the answers before continuing. The repair is short: `View` is a layout host and `Text` is a text host. Metro serves the bundle, Hermes runs it, React calculates the description, and the native host commits views.

That model matters because today's components do not create a new rendering system. They return combinations of the same host components.

---

## Five host components, five native jobs

Today's core components are not a bag of tag replacements. Each one asks the host for a different kind of native behavior.

```text
View        group and lay out children
Text        measure and render text
Image       display image data inside reserved space
ScrollView  let bounded content move through a viewport
Pressable   recognize a press and report interaction state
```

A **viewport** is the visible window through which larger content is seen. A `ScrollView` can contain content taller than that window and move it past the window.

The browser can make many HTML elements behave similarly with CSS and event listeners. React Native begins with narrower primitives whose names communicate their native job.

Do not decide by appearance. A `View` can be colored until it looks like a button, but it still lacks the interaction contract that `Pressable` provides. A `Text` can be wrapped in a box, but it is still the component responsible for text layout.

---

## Before the component extraction, predict the maintenance trace

Imagine ten copied cards. Product changes the action wording from "Begin" to "Start pause" and requires every action to expose button semantics.

Write the number of editing sites for each version:

```text
ten copied card trees:       ? sites for wording, ? sites for semantics
ten uses of one card:        ? component implementation, ? content inputs
```

Also write one failure a screenshot comparison might miss.

---

## Maintenance trace feedback

Ten copied trees create ten wording sites and ten semantic sites. One shared card creates one implementation site for the shared action and ten content inputs only when the content itself differs.

The screenshot might miss the semantic drift entirely. Two actions can have identical color, size, and wording while only one is announced as a button to assistive technology.

**Assistive technology** is software or hardware that helps a person operate the device through another mode, such as a screen reader announcing controls or switch access moving between them. It needs the role and state of an action, not only button-shaped pixels.

This is the first reason for a component boundary:

```text
shared product meaning
        -> one component contract
        -> many supplied content values
```

The boundary is useful when the structure and rules should move together. Extracting every three lines into a component would add names without protecting a product idea.

---

## A component names a repeated product idea

Start with the smallest extraction:

```tsx
import { Text, View } from 'react-native';

function PauseCard() {
  return (
    <View>
      <Text>Morning walk</Text>
      <Text>10 minutes</Text>
    </View>
  );
}
```

`PauseCard` begins with a capital letter so JSX treats it as your component rather than a host component name. React calls it. It returns a description containing one `View` and two `Text` nodes.

This removes copied structure, but both uses would still say the same thing. The missing piece is a way for a parent to supply variation.

> Extract a component when repeated UI represents one product idea whose structure should change together.

A component is not valuable merely because it shortens a file. `PauseCard` is useful because the name and its inputs can express a card contract.

```quiz
{
  "prompt": "Two content cards should receive the same accessibility fix whenever the shared structure changes. What is the strongest reason to extract a component?",
  "multiple": false,
  "options": [
    {"text":"It makes React Native render HTML.","correct":false},
    {"text":"It guarantees every possible card design fits.","correct":false},
    {"text":"It gives the shared product idea one implementation boundary.","correct":true},
    {"text":"It removes the need for props.","correct":false}
  ],
  "explanation": "A shared boundary keeps common structure and behavior together. It does not promise that unrelated designs belong in one component."
}
```

---

## The fixed component fails on its second use

If you render `<PauseCard />` twice, both cards say "Morning walk." Renaming the second component or duplicating it recreates the original maintenance problem.

What you need is a function input:

```tsx
type PauseCardProps = {
  title: string;
  detail: string;
};

function PauseCard({ title, detail }: PauseCardProps) {
  return (
    <View>
      <Text>{title}</Text>
      <Text>{detail}</Text>
    </View>
  );
}
```

`PauseCardProps` describes the accepted object. Each property is required and must be a string. The parameter receives that object. `{ title, detail }` extracts its two properties. The colon applies the TypeScript type to the parameter.

Inside JSX, `{title}` switches from markup to a JavaScript expression. React Native gives the resulting string to `Text`.

---

## Read the props type one mark at a time

```tsx
type PauseCardProps = {
  title: string;
  detail: string;
};
```

`type` creates a TypeScript name for a shape. `PauseCardProps` is that name. The outer braces describe an object shape rather than running a block of statements.

`title: string` says an object matching this shape must have a property named `title`, and the property value must be text. The semicolon ends that property declaration. It does not render punctuation.

The component applies the contract here:

```tsx
function PauseCard({ title, detail }: PauseCardProps) {
```

The parameter receives one props object. `{ title, detail }` is object destructuring: it creates local names by reading properties with those names. `: PauseCardProps` tells TypeScript which object shape the parameter must follow.

The same operation written without destructuring is longer but useful as a mental repair:

```tsx
function PauseCard(props: PauseCardProps) {
  const title = props.title;
  const detail = props.detail;
  // return JSX using title and detail
}
```

Destructuring changes convenience, not data flow. The parent still supplies one props object and the child still reads it.

---

## Watch TypeScript reject three different contract breaks

Try these one at a time. Predict the message category before reading the editor:

```tsx
<PauseCard title="Morning walk" />

<PauseCard title="Morning walk" detail={10} />

<PauseCard title="Morning walk" detail="10 minutes" colour="green" />
```

The first omits a required property. The second supplies the property with the wrong value type. The third invents a property the contract does not accept.

These failures happen before the phone needs to interpret the card. TypeScript is checking whether each caller satisfies the declared component boundary.

The checker cannot prove that "10 minutes" is accurate or that the title is helpful. It proves structural claims only.

Repair all three calls before continuing:

```tsx
<PauseCard title="Morning walk" detail="10 minutes" />
```

---

## Props are inputs, not a second state system

This mutation is the wrong model:

```tsx
function PauseCard(props: PauseCardProps) {
  props.title = 'Changed inside the child';
  return <Text>{props.title}</Text>;
}
```

The parent chose the input for this render. The child should calculate a description from it, not rewrite the parent's supplied object.

If a different title is needed, the owner supplies a different prop on a later render:

```text
render 1: parent supplies title "Morning walk"
render 2: parent supplies title "Evening walk"
```

Day 3 introduces state, which is React-managed memory that can cause that later render. Today, props remain read-only inputs. Keeping that boundary clean makes tomorrow's ownership decision possible.

---

## Props flow from parent to child

The parent now chooses content:

```tsx
export default function App() {
  return (
    <View>
      <PauseCard title="Morning walk" detail="10 minutes" />
      <PauseCard title="Drink water" detail="One glass" />
    </View>
  );
}
```

Trace the first call:

```text
App supplies { title: "Morning walk", detail: "10 minutes" }
PauseCard receives that props object
PauseCard returns View + two Text descriptions
the host commits the corresponding native views
```

Props are read-only inputs to this calculation. If `PauseCard` needs different content, the parent supplies different props and React calculates another description. The child does not edit its props object.

Predict before trying: what does TypeScript report if the second call omits `detail`? It reports that a required property is missing, before that incomplete contract reaches the device.

---

## `children` solves a different kind of variation

Adding `subtitle`, `caption`, `badge`, and `footerText` props can turn a small card into a form with dozens of switches. Sometimes the card should own the frame while the parent owns the content placed inside it.

First see the pressure:

```tsx
<ContentCard title="Reset" detail="A two-line explanation" buttonLabel="Begin" />
```

This works for exactly the content shape the component predicted. It becomes awkward when one caller needs two paragraphs or a small image.

Use `children` for the open content region:

```tsx
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

type ContentCardProps = {
  title: string;
  children: ReactNode;
};

function ContentCard({ title, children }: ContentCardProps) {
  return (
    <View>
      <Text>{title}</Text>
      {children}
    </View>
  );
}
```

`ReactNode` is the type for content React knows how to render, including elements and text. `children` is the content written between opening and closing component tags.

```tsx
<ContentCard title="Reset">
  <Text>Put both feet on the floor.</Text>
  <Text>Notice one sound near you.</Text>
</ContentCard>
```

The card owns the frame and title. The parent composes the body. Use a named prop when the component needs the value for a specific decision. Use `children` when it only needs to provide a place for renderable content.

---

## A named prop gives the component a named responsibility

Suppose the card must show a different title treatment when an item is urgent. A named prop fits because the component uses the value to make a specific decision:

```tsx
type ContentCardProps = {
  title: string;
  urgent?: boolean;
  children: ReactNode;
};
```

The `?` means callers may omit `urgent`. When omitted, reading it produces `undefined`, which behaves as false in this condition:

```tsx
<Text style={urgent ? styles.urgentTitle : styles.title}>{title}</Text>
```

Now compare an arbitrary body:

```tsx
<ContentCard title="Reset">
  <Text>Put both feet on the floor.</Text>
  <Text>Notice one nearby sound.</Text>
</ContentCard>
```

The frame does not need to ask whether the body has one line, two lines, or an image. It provides a slot and renders the supplied `children`.

Decision rule:

```text
Does the component need the value to make a named decision?
  yes -> named prop

Does the component only need to frame renderable content chosen by the caller?
  yes -> children
```

This rule survives the travel-card transfer task. "Urgent" may deserve a named Boolean because the card changes semantics and appearance. A caller-authored paragraph belongs in `children`.

---

## `ReactNode` is wider than one component type

`children: ReactNode` does not mean "children must be a `Text`." It means React-renderable content can occupy the slot.

For today's native boundary, the caller is still responsible for valid host nesting. `ReactNode` accepts a string at the TypeScript level, but a raw string placed under a `View` still violates React Native's runtime text rule.

```tsx
<ContentCard title="Broken">
  raw words under the card's View
</ContentCard>
```

The type says React understands a string as renderable content in some context. The native host says this particular parent is not a text context.

This is a valuable distinction:

```text
TypeScript question: is this value allowed by the declared component contract?
native-host question: is this child valid in this rendered position?
```

Passing one check does not erase the other.

```quiz
{
  "prompt": "A card owns its border and title, but callers need different body structures. Which contract fits that pressure?",
  "multiple": false,
  "options": [
    {"text":"Duplicate the card for every body shape.","correct":false},
    {"text":"Accept the body as typed `children`.","correct":true},
    {"text":"Store the body in a global variable.","correct":false},
    {"text":"Render the body as raw text under `View`.","correct":false}
  ],
  "explanation": "`children` lets the component own a frame while the caller composes renderable body content."
}
```

---

## Text nesting is semantic, not a layout shortcut

This valid nesting makes part of one native text run bold:

```tsx
<Text>
  Today: <Text style={{ fontWeight: '700' }}>two pauses</Text>
</Text>
```

The inner `Text` participates in the surrounding text flow. Contrast that with two sibling text nodes:

```tsx
<View>
  <Text>Today:</Text>
  <Text>two pauses</Text>
</View>
```

Those are separate layout children. Use nested `Text` when pieces belong to one sentence or text run. Use a `View` when you need to lay out separate blocks.

A browser habit such as putting `View` inside a sentence is the wrong model. `Text` has a text-layout context with different allowed nesting behavior.

---

## Why nested text behaves differently

Text layout must shape characters into lines. It considers font size, weight, available width, and where a line may wrap. Nested `Text` stays inside that one text-layout calculation.

```tsx
<Text>
  Today: <Text style={{ fontWeight: '700' }}>two pauses</Text>
</Text>
```

The outer and inner parts can form one sentence and wrap as one run.

Two sibling `Text` components under `View` are two layout children:

```tsx
<View>
  <Text>Today:</Text>
  <Text>two pauses</Text>
</View>
```

Whether those siblings sit above, below, or beside each other depends on the container layout. They are not one sentence merely because their words look related.

Predict before running: if the device uses a larger text size and the sentence wraps, which version preserves the phrase as one flowing text run? The nested version does. The sibling version remains two separate layout items.

Use `View` to compose blocks. Use nested `Text` to style parts of one textual statement.

---

## Images expose a missing-size failure

Add a remote image without dimensions:

```tsx
<Image source={{ uri: 'https://picsum.photos/400/240' }} />
```

The request may succeed while the image occupies no useful space. The remote file's eventual pixel size is not a stable layout instruction for the native screen. Give the layout dimensions:

```tsx
<Image
  source={{ uri: 'https://picsum.photos/400/240' }}
  style={{ width: '100%', height: 160 }}
  accessibilityLabel="A calm landscape"
/>
```

`source` receives an object with a network `uri`. `style` reserves width and height. `accessibilityLabel` supplies meaning that pixels alone do not expose.

A bundled image uses `require`:

```tsx
<Image source={require('./assets/icon.png')} style={{ width: 48, height: 48 }} />
```

Both examples are runnable in the blank Expo project when the local file exists. Day 8 explores responsive media and loading behavior. Today's rule is narrower: remote images need explicit layout size, and meaningful images need a useful description.

---

## Separate image data from image layout

The remote `source` object answers where the bytes come from:

```tsx
source={{ uri: 'https://picsum.photos/400/240' }}
```

There are two sets of braces. The outer pair enters a JavaScript expression from JSX. The inner pair creates an object with a `uri` property.

The style answers how much room the component receives:

```tsx
style={{ width: '100%', height: 160 }}
```

These are separate questions:

```text
source -> which image data?
style  -> which rectangle in the layout?
```

The network can return a perfectly valid file while layout assigns no useful rectangle. That is why "the URL works in my browser" does not diagnose an invisible native image.

Use this order when it is missing:

1. Give the component an obvious fixed width and height.
2. Confirm whether that rectangle appears.
3. Then investigate the source request or file path.

Changing five network settings before proving the component has space mixes two failure categories.

---

## Meaningful and decorative images are different product choices

`accessibilityLabel="A calm landscape"` exposes a description to someone who cannot use the pixels. The label should communicate the image's purpose in this card, not dump a filename or repeat nearby text.

If an image is purely decorative and adds no information, repeating a label can create noise. If the image distinguishes the exercise or carries content, omitting a description hides meaning.

Today's card uses a meaningful scene, so it has a label. The point is not "every image gets the same prop." The point is to decide whether the image contributes information and make the nonvisual experience match that decision.

---

## Scroll only the region that can outgrow the screen

Three cards fit. Twelve cards can extend below the phone. A plain root `View` lays them out, but it does not automatically provide document scrolling like a browser page.

Wrap the bounded content collection in `ScrollView`:

```tsx
<ScrollView contentContainerStyle={styles.content}>
  <ContentCard title="See">...</ContentCard>
  <ContentCard title="Hear">...</ContentCard>
</ScrollView>
```

`ScrollView` creates a native scrolling container and renders all of its children. That makes it suitable for a small, bounded screen such as today's three-card exercise. It is not the scaling choice for hundreds of repeated records because all children are created. Virtualized lists belong to Day 9.

`contentContainerStyle` styles the inner container holding the children. Styling the outer `ScrollView` and styling its content are different jobs.

---

## The viewport and the content are two boxes

A `ScrollView` has an outer visible region and an inner content container:

```text
ScrollView viewport
┌──────────────────────────┐
│ content container        │
│  card 1                  │
│  card 2                  │
│  card 3                  │
│  card 4 extends below... │
└──────────────────────────┘
```

`style` affects the outer scrolling component. `contentContainerStyle` affects the box that holds the cards. Padding and gaps around the cards normally belong on the content container, which is why today's example uses that prop.

Now break the bounded assumption. Imagine 2,000 cards. `ScrollView` creates all 2,000 children even though the phone can show perhaps six at once. Creation, measurement, and memory costs arrive before the user reaches most of them.

That does not make `ScrollView` bad. It makes the decision conditional:

```text
small content whose size is naturally bounded -> ScrollView is direct and clear
large data-backed collection                  -> later virtualized-list tool
```

Do not pull the Day 9 API forward. Today, name the pressure and stay with the bounded three-card screen.

```quiz
{
  "prompt": "Why is `ScrollView` reasonable for today's three-card screen but not automatically the choice for 2,000 records?",
  "multiple": false,
  "options": [
    {"text":"It renders all children, which is fine for bounded content but costly at large scale.","correct":true},
    {"text":"It converts native cards into HTML.","correct":false},
    {"text":"It can contain only text.","correct":false},
    {"text":"It prevents reusable components.","correct":false}
  ],
  "explanation": "`ScrollView` provides native scrolling but creates every child. Large data sets need the later virtualized-list model."
}
```

---

## A pressable describes an interaction surface

A `View` can look like a button without communicating button behavior. Start with the tempting version:

```tsx
<View style={styles.action}>
  <Text>Begin</Text>
</View>
```

It has button-shaped pixels but no press callback or pressed feedback. Replace the interaction boundary:

```tsx
<Pressable
  accessibilityRole="button"
  onPress={() => console.log('Begin pressed')}
  style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
>
  <Text style={styles.actionText}>Begin</Text>
</Pressable>
```

`onPress` receives a function. The arrow delays the log until a press. Passing `console.log('Begin pressed')` would run during render and pass its return value instead.

The `style` prop can receive a function. React Native calls it with interaction state. The array applies `styles.action` and, while pressed is true, `styles.actionPressed`. This is feedback during the gesture, not application memory. Day 3 introduces state that survives after the press completes.

`accessibilityRole="button"` exposes the semantic role. The visible label already names the action, so a duplicate accessibility label is unnecessary here.

---

## A press is a sequence, not a mouse click renamed

On a touch screen, a finger goes down, may move, and comes up. `Pressable` recognizes whether that sequence counts as a press and exposes temporary interaction state while it is happening.

For today's successful tap:

```text
finger down inside action
  -> pressed becomes true
  -> pressed style lowers opacity

finger up as a valid press
  -> onPress callback runs
  -> pressed becomes false
  -> base opacity returns
```

The `pressed` value belongs to the current gesture. It is not a history of whether this card has ever been pressed. If the product must remember completion after the finger lifts, that is state, and Day 3 owns it.

Before running this broken version, predict when the log occurs:

```tsx
<Pressable onPress={console.log('Begin pressed')}>
  <Text>Begin</Text>
</Pressable>
```

JavaScript must evaluate the prop expression while building the description. It calls `console.log` immediately and passes the returned `undefined` as `onPress`. The action later has no callback.

The working arrow is a function value:

```tsx
onPress={() => console.log('Begin pressed')}
```

React Native can call that function after a valid press. This is callback passing, not special `Pressable` punctuation.

---

## Assemble the reusable card

This `App.tsx` is runnable in the blank Expo project:

```tsx
import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type ResetCardProps = {
  title: string;
  imageUri?: string;
  onBegin: () => void;
  children: ReactNode;
};

function ResetCard({ title, imageUri, onBegin, children }: ResetCardProps) {
  return (
    <View style={styles.card}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} accessibilityLabel="Calm outdoor scene" />
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>{children}</View>
      <Pressable
        accessibilityRole="button"
        onPress={onBegin}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Begin</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.heading}>Pocket Pause</Text>
      <ResetCard title="Notice what you see" onBegin={() => console.log('see')}>
        <Text>Name five objects without judging them.</Text>
      </ResetCard>
      <ResetCard
        title="Notice what you hear"
        imageUri="https://picsum.photos/600/360"
        onBegin={() => console.log('hear')}
      >
        <Text>Find one nearby sound and one distant sound.</Text>
      </ResetCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, padding: 24, gap: 16, backgroundColor: '#eef6f2' },
  heading: { marginTop: 32, fontSize: 30, fontWeight: '700', color: '#17352b' },
  card: { gap: 12, padding: 18, borderRadius: 16, backgroundColor: '#ffffff' },
  image: { width: '100%', height: 160, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#17352b' },
  body: { gap: 6 },
  button: { minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#2f6654' },
  buttonPressed: { opacity: 0.7 },
  buttonText: { color: '#ffffff', fontWeight: '700' },
});
```

`imageUri?` marks that prop optional. The conditional renders `Image` only when a string exists. `onBegin: () => void` requires a function that takes no arguments and returns no meaningful value. TypeScript now checks each use against the contract.

---

## Trace two card calls through one implementation

Predict the host children for each card before reading the trace.

```text
card A: title, no imageUri, one Text child, onBegin callback
card B: title, imageUri, one Text child, onBegin callback
```

For card A, `imageUri` is `undefined`. The conditional expression chooses `null`, so the card returns no `Image` for that position. It still returns the title, body, and `Pressable`.

For card B, `imageUri` is a string. The expression returns an `Image` with a remote source object and the reserved image style.

```text
ResetCard call A
  -> View
     -> Text title
     -> View body -> caller's Text
     -> Pressable -> Text label

ResetCard call B
  -> View
     -> Image
     -> Text title
     -> View body -> caller's Text
     -> Pressable -> Text label
```

Both calls share one structural implementation without becoming visually identical. The inputs choose legitimate variation.

Now change the literal action label `Begin` once in the component. Both cards change. Change only card B's `title` prop. Only card B changes. That is the boundary doing useful work.

---

## Do not turn every variation into a Boolean switch

A component can become harder to use than copied markup if its contract grows like this:

```tsx
type CardProps = {
  compact?: boolean;
  imageOnLeft?: boolean;
  showDivider?: boolean;
  titleIsGreen?: boolean;
  twoParagraphs?: boolean;
  centeredAction?: boolean;
};
```

Each Boolean creates combinations. Six independent switches allow many arrangements, including combinations nobody designed.

Ask whether the uses still represent one product idea with controlled variation. Named data such as `title` and `imageUri`, one action callback, and an open body slot are coherent. A growing collection of layout toggles may be evidence that two different component designs are being forced into one boundary.

> Reuse the product rule, not merely a similar rectangle.

---

## An empty state is a product state

If a screen receives no cards, an empty `ScrollView` is technically valid and practically confusing. The user cannot tell whether content is loading, missing, or finished.

At today's scope, render an explicit empty component:

```tsx
type EmptyStateProps = { message: string };

function EmptyState({ message }: EmptyStateProps) {
  return (
    <View accessibilityRole="summary" style={styles.card}>
      <Text style={styles.title}>Nothing queued</Text>
      <Text>{message}</Text>
    </View>
  );
}
```

This is composition again: a named product state with a typed input. It does not need state management yet. Day 3 will decide which component owns changing data.

```quiz
{
  "prompt": "A screen has zero cards and currently renders blank space. What is the most useful component-level repair?",
  "multiple": false,
  "options": [
    {"text":"Hide the heading too.","correct":false},
    {"text":"Add an explicit typed empty-state component explaining the condition.","correct":true},
    {"text":"Duplicate a fake card permanently.","correct":false},
    {"text":"Use a browser placeholder attribute.","correct":false}
  ],
  "explanation": "An explicit empty state tells the user what zero content means and keeps that product state reusable."
}
```

---

## Practice: build, break, transfer

Do not reveal the feedback screen until each tier has an artifact or a written prediction.

### Tier 1: classify the host job

For each requirement, choose `View`, `Text`, `Image`, `ScrollView`, or `Pressable`, then give the native job that made you choose it:

1. style one phrase inside a sentence;
2. group a title and body as separate blocks;
3. show a remote photograph in a known rectangle;
4. let four bounded cards move through a short screen;
5. expose a surface that reports a valid press.

### Tier 2: complete a typed contract

Fill the missing types without looking back:

```tsx
type ReminderCardProps = {
  title: _____;
  imageUri__: _____;
  onOpen: _____;
  children: _____;
};
```

Then write the destructured function parameter. Create one valid call, one call missing the title, and one call with a number for `imageUri`. Predict which two fail type checking.

---

### Tier 3: build the realistic card set

Run the complete card screen. Add a third card without copying the card structure. Give one card no image, one a remote image, and one two body paragraphs. Verify that all three action callbacks log distinct values.

Test with larger device text. Confirm that the two-paragraph body remains composed content and that no visible string sits directly under `View`.

---

### Tier 4: diagnose two different failures

Remove the remote image height and observe the allocated space. Restore it.

Then replace `onPress={onBegin}` with `onPress={onBegin()}`. Predict when the function runs and what value reaches `onPress`. Capture the evidence and repair it.

Explain why one failure concerns the image's layout rectangle while the other concerns function calling time.

---

### Tier 5: changed-task transfer

Build a reusable `PackingCard` for a travel checklist. It needs a required destination title, an optional meaningful image, caller-composed body content, and an action callback. Do not add state.

Decide how to represent "fragile":

- choose a named prop if the card itself changes a specific semantic or visual rule;
- choose `children` if "fragile" is merely part of arbitrary caller-authored body content.

Write the decision and the consequence before coding it. Add an explicit empty state for a trip with no packing cards.

Mark work as **with help**, **independent once**, **recalled after a delay**, or **transferred**.

---

## Practice feedback: inspect the reasoning

The host-job mapping is:

```text
phrase inside one sentence      -> nested Text
separate layout blocks          -> View
image data in reserved space    -> Image
bounded overflowing content     -> ScrollView
press recognition and feedback  -> Pressable
```

The contract completion is:

```tsx
type ReminderCardProps = {
  title: string;
  imageUri?: string;
  onOpen: () => void;
  children: ReactNode;
};
```

The missing-title call breaks a required property. The numeric `imageUri` breaks the declared string type. A valid card may omit `imageUri` because `?` marks it optional.

For the callback failure, `onBegin()` runs while React calculates JSX. The returned value, usually `undefined`, becomes the prop. `onBegin` without parentheses passes the function for later.

For the image failure, preserve the distinction: a successful request does not allocate layout space. Restoring an explicit rectangle repairs the layout question before you investigate the source question.

A strong `PackingCard` transfer keeps one component implementation, uses props for named responsibilities, uses `children` for the open region, and does not import state from tomorrow's lesson.

---

## Review queue

1. From memory, explain when to use a named prop and when to use `children`.
2. Rebuild a typed card contract and diagnose one missing required prop.

Review after roughly 1, 3, 7, 14, and 30 days, adapting to performance and keeping the daily queue bounded.

---

## Common mistakes

| Symptom | Cause | Repair |
|---|---|---|
| every card is a copy | shared product idea has no boundary | extract one typed component |
| raw words under `View` | browser text model carried into native | render words with `Text` |
| remote image has no useful size | layout received no dimensions | provide explicit width and height |
| log runs during render | callback was called instead of passed | pass a function to `onPress` |
| tiny bounded screen uses a complex list | scaling tool chosen before pressure exists | use `ScrollView` for bounded content |

---

## Cheat sheet

```text
View        groups and lays out native content
Text        renders and nests native text
Image       needs a source; remote media needs layout size
ScrollView  scrolls a bounded set and renders all children
Pressable   exposes press behavior and gesture feedback
props       parent-supplied component inputs
children    caller-composed renderable content
```

---

## Tomorrow

The card can report a press, but it cannot yet remember that anything happened. Tomorrow the screen gains state, controlled text input, keyboard behavior, disabled semantics, and one owner for each fact.

```finalquiz
{
  "title": "Day 2: Core Components, Props & Typed Composition",
  "questions": [
    {"id":"q1","type":"single_correct","prompt":"Why extract `ResetCard` from repeated markup?","codeSnippet":null,"options":[{"id":"a","text":"To make the screen use HTML"},{"id":"b","text":"To keep one product idea's structure and fixes together"},{"id":"c","text":"To remove every prop"},{"id":"d","text":"To make all cards identical forever"}],"correctOptionIds":["b"],"explanation":"The component names one shared product idea and centralizes its contract.","example":"One accessibility repair reaches every `ResetCard` use."},
    {"id":"q2","type":"multiple_correct","prompt":"Which are jobs of `Text` taught today?","codeSnippet":null,"options":[{"id":"a","text":"Hosting visible native text"},{"id":"b","text":"Bundling imported modules"},{"id":"c","text":"Creating a browser DOM"},{"id":"d","text":"Supporting styled spans through nested `Text`"}],"correctOptionIds":["a","d"],"explanation":"`Text` hosts native text and can nest text runs. Metro bundles modules.","example":"A bold phrase can be nested inside one sentence."},
    {"id":"q3","type":"single_correct","prompt":"What does `detail: string` in a props type require?","codeSnippet":null,"options":[{"id":"a","text":"An optional number"},{"id":"b","text":"A callback"},{"id":"c","text":"A required string prop"},{"id":"d","text":"A native image"}],"correctOptionIds":["c"],"explanation":"Without `?`, the property is required, and its value must be a string.","example":"Omitting `detail` from a use produces a type error."},
    {"id":"q4","type":"single_correct","prompt":"When is typed `children` a good fit?","codeSnippet":null,"options":[{"id":"a","text":"When a component needs to mutate parent data"},{"id":"b","text":"When the body must always be one string"},{"id":"c","text":"When no content should render"},{"id":"d","text":"When the component owns a frame and callers compose its body"}],"correctOptionIds":["d"],"explanation":"`children` creates an open content region without predicting every body shape.","example":"A card frame can accept two caller-supplied `Text` nodes."},
    {"id":"q5","type":"single_correct","prompt":"Why can a remote image be invisible even when its request succeeds?","codeSnippet":null,"options":[{"id":"a","text":"The layout may have no explicit dimensions for it"},{"id":"b","text":"React Native rejects all network images"},{"id":"c","text":"Images require HTML"},{"id":"d","text":"TypeScript removes pixels"}],"correctOptionIds":["a"],"explanation":"A remote file's data does not provide a dependable native layout size. Reserve dimensions.","example":"Set `width` and `height` in the image style."},
    {"id":"q6","type":"multiple_correct","prompt":"Which statements about today's `ScrollView` are accurate?","codeSnippet":null,"options":[{"id":"a","text":"It provides native scrolling"},{"id":"b","text":"It renders all children"},{"id":"c","text":"It is suitable for a small bounded card set"},{"id":"d","text":"It virtualizes thousands of rows"}],"correctOptionIds":["a","b","c"],"explanation":"`ScrollView` scrolls and creates all children. Virtualization is a later list tool.","example":"Three instructional cards are bounded content."},
    {"id":"q7","type":"single_correct","prompt":"Why pass `() => console.log('Begin')` to `onPress`?","codeSnippet":null,"options":[{"id":"a","text":"To run the log while rendering"},{"id":"b","text":"To delay the log until the press callback runs"},{"id":"c","text":"To store permanent data"},{"id":"d","text":"To create an image source"}],"correctOptionIds":["b"],"explanation":"The arrow is a function value. Calling the log directly would run it during render.","example":"Event props receive functions to invoke later."},
    {"id":"q8","type":"single_correct","prompt":"What does the `pressed` value in a `Pressable` style function represent?","codeSnippet":null,"options":[{"id":"a","text":"Permanent application state"},{"id":"b","text":"The number of past presses"},{"id":"c","text":"Whether the current gesture is pressing the surface"},{"id":"d","text":"Whether Metro is ready"}],"correctOptionIds":["c"],"explanation":"`pressed` is transient interaction state supplied while the gesture is active.","example":"Lower opacity while pressed, then restore it on release."},
    {"id":"q9","type":"multiple_correct","prompt":"Which changes strengthen the card's native product contract?","codeSnippet":null,"options":[{"id":"a","text":"Type required and optional inputs"},{"id":"b","text":"Give a meaningful image label"},{"id":"c","text":"Copy markup for every item"},{"id":"d","text":"Expose button semantics on the action"}],"correctOptionIds":["a","b","d"],"explanation":"Types, image meaning, and action semantics make the shared boundary safer. Copies let it drift.","example":"A single typed component can enforce the same contract at each call site."},
    {"id":"q10","type":"single_correct","prompt":"A travel card needs arbitrary body content but a required destination title. Which design fits?","codeSnippet":null,"options":[{"id":"a","text":"Required `title` prop plus typed `children`"},{"id":"b","text":"A global destination variable"},{"id":"c","text":"Raw strings directly under `View`"},{"id":"d","text":"One duplicated component per destination"}],"correctOptionIds":["a"],"explanation":"The title has a named role; the varying body is a composable region.","example":"This transfers the same boundary to a changed domain."}
  ]
}
```
