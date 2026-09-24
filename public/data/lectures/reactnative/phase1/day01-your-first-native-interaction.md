# Day 1: React Native Mental Model & Expo SDK 57 Setup

**Duration: 4 hours | Focus: understand the native render path and run one typed screen on a real device**

---

## Why this day exists

A screen can look the same in a browser and on a phone while being built from different pieces.

That difference stays hidden until you try to use a browser tag, inspect the page as HTML, or explain what actually runs on the device.

Today you will make a tiny welcome screen appear on Android, iOS, and web. More importantly, you will be able to trace how your TypeScript becomes a screen you can touch.

When one stage fails, that trace will tell you what to inspect next instead of making you restart everything.

---

## The first browser-shaped attempt

Suppose you put this in a new mobile project:

```tsx
export default function App() {
  return <div>Hello from my phone</div>;
}
```

That is a sensible guess if you know React for the web. A browser knows that `div` means an HTML element. React Native does not ask a browser to create HTML on Android or iOS, so the guess fails before a useful native screen appears.

The important question is not, "Which spelling replaces `div`?" It is, "Who receives the description and what can that receiver create?"

### Predict before feedback

Choose the path you expect on a phone and write one reason:

```text
A. TypeScript -> HTML -> browser page
B. TypeScript -> React description -> native platform views
C. TypeScript -> screenshot -> native platform views
```

---

## One component, two kinds of host

React calls your component function and receives a description of what you want. A **host** turns that description into things its platform can display.

```text
your component
      |
      v
React description
      |
      +---- web host ----------> DOM elements
      |
      +---- React Native host -> Android/iOS native views
```

On the web, a host can create a `div`. On Android and iOS, React Native supplies host components such as `View` and `Text`. Those names are JavaScript-facing building blocks backed by the target platform's UI system.

So prediction B is the useful model. Your component is shared JavaScript or TypeScript, but the phone is not secretly drawing a web page.

> On Android and iOS, React Native renders platform views, not a DOM tree.

This does not mean every result looks identical. The platforms have different fonts, controls, system bars, and conventions. Day 4 treats those differences directly.

---

## What the unfamiliar nouns mean

The previous picture used four words that are easy to repeat without understanding. Give each one a concrete job now.

**A component** is a JavaScript or TypeScript function that returns a UI description. `App` will be your first component. Calling it does not paint pixels by itself.

**JSX** is the angle-bracket notation inside that return value. It looks like markup, but the build tools turn it into JavaScript instructions that create a description.

**A host component** is the last React component before the target platform takes over. `View` and `Text` are host components on React Native. `div` and `p` are host components for React on the web.

**A native view** is an object managed by Android or iOS that participates in that platform's layout, drawing, input, and accessibility systems. It is not a screenshot and it is not HTML hidden behind the screen.

Keep the boundary visible:

```text
your function returns JSX
        |
        v
React builds a description
        |
        v
the active host creates platform UI objects
        |
        v
Android or iOS measures, draws, and handles them
```

The operating system does the final drawing. React Native coordinates the description and the native objects that should represent it.

---

## The DOM is a browser-owned tree

The **DOM**, or Document Object Model, is the browser's in-memory tree for an HTML document. A browser knows what a `div` is because HTML and the DOM define that element.

```text
browser document
└── body
    └── div
        └── text node
```

An Android app does not begin with an HTML document. An iOS app does not begin with one either. There is therefore no browser-owned `body` waiting for your `div`.

React Native supplies another host vocabulary:

```text
native screen
└── View
    └── Text
```

This is why replacing `div` with `View` is more than a spelling change. You are choosing a component whose contract the native host understands.

The same source may also run on web through React Native Web. In that target, a web adapter can translate supported React Native components to browser output. That does not change what Android and iOS render.

---

## Prediction feedback: follow the receiver

The correct earlier prediction was:

```text
TypeScript -> React description -> native platform views
```

You can re-derive that answer without memorizing it. Ask two questions:

1. Which program receives the description?
2. Which UI objects can that program create?

On web, the receiver is a browser host and its vocabulary includes DOM elements. On a phone, the receiver is the React Native host and its vocabulary includes native-backed components.

That diagnostic transfers. If a tutorial says "select the element with `document.querySelector`" while you are building an Android screen, ask who provides `document`. The browser does. Your phone screen has no browser document unless you deliberately embed a web view, which this course has not done.

> When a browser-shaped API fails in a native screen, identify the missing host capability before searching for a package with a similar name.

```quiz
{
  "prompt": "A learner replaces `View` with `div` in a screen meant for Android. What is the underlying mistake?",
  "multiple": false,
  "options": [
    { "text": "They forgot to add a CSS file.", "correct": false },
    { "text": "They asked the native host to create a browser-specific element.", "correct": true },
    { "text": "They used TypeScript instead of JavaScript.", "correct": false },
    { "text": "They tested on a physical device.", "correct": false }
  ],
  "explanation": "`div` belongs to the browser's host vocabulary. A native screen uses React Native host components such as `View` and `Text`."
}
```

---

## Two closed-notes checks before setup

There is no earlier React Native day to retrieve from, so use the course prerequisites.

1. In TypeScript, does a type error prove that the program crashed, or that the checker found an unsafe mismatch before runtime?
2. In React, does a component return finished pixels, or a description React can process?

Commit to both answers before continuing.

---

## Repair the prerequisite model

A TypeScript error is feedback from a checker. It can catch a mismatch before the app runs, but passing the checker does not prove correct behavior.

A React component returns a description. React and the current host decide how that description becomes visible output.

```text
TypeScript checks values and component contracts
React calculates the requested UI description
React Native commits that description to native views
the operating system draws and handles the screen
```

A red type error, a bundler error, and a screen that looks wrong come from different stages. This separation will guide every debugging decision today.

---

## Check the tools before creating the app

This course targets Node 22, npm, React Native 0.86, and Expo SDK 57. Ask the terminal what is actually installed:

```bash
node --version
npm --version
```

The first command should begin with `v22.`. The exact npm patch version can vary because npm is shipped and updated separately.

Why check first? If creation fails, you need to distinguish "my source code is wrong" from "the tool that creates the project is missing or incompatible." A version check gives you evidence before you change anything.

If `node` is missing or reports another major version, install or select Node 22 using your normal version manager. Open a fresh terminal and check again.

---

## Create a project with one obvious entry file

```bash
npx create-expo-app@latest pocket-pause --template blank-typescript
cd pocket-pause
npm start
```

`npx` downloads and runs the creator without requiring a permanent global command. `pocket-pause` becomes the folder. `--template blank-typescript` chooses a minimal TypeScript project with `App.tsx` as the entry point. That keeps navigation out of Day 1. File-based routing belongs to Day 12.

`npm start` runs the project's `start` script. In this Expo project, it starts the development server and prints a QR code plus platform commands.

Do not paste dependency versions from an unrelated tutorial into `package.json`. Expo SDK 57 expects a compatible family of React and React Native packages. Let the creator establish that family.

---

## Read the creation command instead of chanting it

The command is short enough to hide several jobs:

```bash
npx create-expo-app@latest pocket-pause --template blank-typescript
```

Read it from left to right.

`npx` asks npm to run a package command. It lets you use the project creator without installing a permanent global copy that may become stale.

`create-expo-app@latest` names the creator and asks npm for its current release. The creator writes a project folder and installs a compatible dependency set.

`pocket-pause` is ordinary input to the creator. It becomes the directory name, not the name of a JavaScript variable.

`--template blank-typescript` is an option and its value. It chooses a small starting project with TypeScript already configured. "Blank" means the project does not pre-teach routing or a product structure for you.

If the command stops before creating the folder, `App.tsx` is not the first suspect. There is no app source to debug yet. Read the terminal from the first error line and identify whether npm could download the creator, whether the target folder was writable, and whether dependency installation completed.

---

## Predict what success leaves behind

Before opening the folder, predict which item owns each job:

```text
App.tsx        package.json        tsconfig.json        assets/

screen entry   npm scripts         TypeScript rules     local media
```

Do not reveal the next screen until you have made the four matches. This is a bounded attempt: every answer follows from the filenames or the creation command.

---

## Project anatomy feedback

The useful starting map is:

```text
pocket-pause/
├── App.tsx          first screen component in this template
├── package.json     project scripts and dependency versions
├── tsconfig.json    TypeScript checking configuration
├── assets/          images and other bundled files
└── node_modules/    installed package code, generated by npm
```

Open `package.json`. A **script** is a named command owned by the project. `npm start` looks up the `start` entry and runs it. You are not asking npm to invent a launch procedure.

A **dependency** is another package this project needs. The versions in this new file form a tested family. That is why copying one React Native version from an older article can break a project that was otherwise coherent.

Do not edit `node_modules`. It is installed output. If a package needs to change, change the declared dependency through npm so the manifest and lockfile record the decision.

Open `App.tsx` next. This file is source. It is where today's screen belongs.

---

## `npm start` opens a development loop

Run:

```bash
npm start
```

The terminal stays occupied because the development server is a long-running process. It is waiting for a target to request the app and for you to save source changes.

This is different from a command such as `node --version`, which prints an answer and exits.

```text
one-shot command               long-running development command
node --version                 npm start
prints one value               keeps watching files
returns your prompt            keeps serving requests
```

If you close that terminal or press `Ctrl+C`, you stop the server. The source files remain. The phone may keep showing the last loaded screen for a moment, but it can no longer request the next bundle from that stopped process.

That distinction explains a common failure: the app appears to "freeze on old code" after the terminal was closed. The native host still exists, but the development path feeding it new code is gone.

---

## The development server is not the app

It is tempting to think the terminal process is "running the app." That model breaks when the terminal is healthy but the phone is disconnected.

```text
your editor          development server          device host
App.tsx changes ---> builds/serves bundle -----> runs bundle
                          ^                          |
                          |<---- requests/reloads --+
```

**Metro** follows your imports and produces the JavaScript bundle the host can run. Expo's development server coordinates Metro and the ways a device can reach it.

**Expo Go** is a prebuilt native host on a phone. It contains native capabilities compatible with its Expo SDK and can load your JavaScript bundle without compiling a new mobile binary after every source edit.

Metro does not draw buttons. Expo Go does not replace your source files. Separate jobs create specific checks instead of a vague "Expo is broken" guess.

---

## Metro follows a graph, not a folder by instinct

Start with one import. A **module** is a unit of code that can export values for another file to import:

```tsx
import { Text } from 'react-native';
```

That line creates a relationship: `App.tsx` depends on the exported `Text` value from the `react-native` package. Metro follows that relationship, then follows the imports used by the imported module, until it has the modules needed for this app.

The result is a **module graph**. A graph here means files connected by imports, not a chart with axes.

```text
App.tsx
  ├── react
  ├── react-native
  │     ├── Text implementation
  │     └── View implementation
  └── ./assets/icon.png
```

Metro transforms the syntax the device does not execute directly, gathers the required modules, and serves development output to the host. It also watches those source files so a save can trigger another build.

Now break one edge on purpose:

```tsx
import { Text } from './missing-file';
```

Predict the stage before saving. React never receives a valid component description because Metro cannot finish the graph. The native host therefore cannot be the cause of this specific failure.

Repair the import before continuing. Deliberate failure is useful only when you close the loop.

---

## Expo Go is a native container with a boundary

Expo Go is already-installed native software. That fact is what makes today's short loop possible:

```text
change TypeScript
   -> Metro prepares new JavaScript
   -> Expo Go loads it
   -> Hermes runs it
```

You are not rebuilding an Android or iOS binary for each text change.

A **native binary** is the installed app package produced by the Android or iOS toolchain. It contains compiled native code. JavaScript source can be refreshed inside today's development host, but changing which native code the installed host contains requires another native build.

The convenience has a boundary. Expo Go can expose native capabilities that were compiled into Expo Go itself. JavaScript cannot add arbitrary new native Android or iOS code to an already-built app.

That limitation does not matter for Days 1 to 3. `View`, `Text`, `Image`, `ScrollView`, `Pressable`, and `TextInput` are available in the host you are using. Later, when the course crosses the native boundary, it will move to a development build with the required native code included.

For today, the precise model is enough:

> Expo Go shortens the JavaScript feedback loop because the native host already exists. It is not a promise that every future native capability can appear without another native build.

```quiz
{
  "prompt": "The terminal shows Metro is ready, but the phone has not loaded the project. Which conclusion is justified?",
  "multiple": false,
  "options": [
    { "text": "The native screen has rendered correctly.", "correct": false },
    { "text": "TypeScript has no possible mistakes.", "correct": false },
    { "text": "The server is running, but the device path still needs checking.", "correct": true },
    { "text": "Expo Go has already received the bundle.", "correct": false }
  ],
  "explanation": "A ready server proves one stage. The device must still reach it, request the bundle, and run the code."
}
```

---

## Put the project on a physical phone

Install Expo Go from the platform's app store. Keep the computer and phone on a network that permits them to reach each other, then scan the QR code shown by `npm start`.

On many Android devices, Expo Go can scan inside the app. On iOS, the Camera app can open the code. If the project does not connect, do not rewrite `App.tsx`. Source code cannot repair a blocked network path.

Use this order:

```text
1. Is Metro still running?
2. Are phone and computer on a usable network?
3. Could a firewall or guest network block device-to-computer traffic?
4. Does reopening the project retry the request?
5. Does the terminal show a bundle request or useful error?
```

Each answer narrows the failing stage.

---

## Read connection evidence in both directions

The phone must first reach the development server. Then the server must send usable output back.

```text
phone  -- request project -->  development server
phone  <-- bundle response --  development server
```

A QR code on the terminal proves only that the server produced connection information. It does not prove the phone can use that route.

Use observations, not rituals:

- If scanning the code does nothing and Metro records no request, investigate the path between phone and computer.
- If Metro records a request and then reports an unresolved module, the network path worked. Follow the import error.
- If the bundle finishes and a red error screen names a source line, execution began. Inspect that line and its inputs.
- If the screen appears but is clipped or unreadable, the path worked. You now have a UI problem, not an installation problem.

Write the last confirmed event before changing anything. "Metro printed a bundle request" is evidence. "Expo hates my Wi-Fi" is a guess.

---

## A simulator and a physical phone answer different questions

A simulator or emulator is a desktop program that imitates a mobile device closely enough for a fast development loop. A physical phone is the real combination of hardware, operating system, network policy, font settings, touch input, and screen cutouts.

Today's first proof should include a physical device because the course promises a mobile workflow, not only a desktop preview.

That does not make the simulator useless. It is excellent for repeating controlled states and checking another screen size. It cannot prove every real-device behavior.

Record evidence honestly:

```text
Android physical phone: opened and rendered
iOS simulator: opened and rendered
iOS physical phone: not tested
web: opened and rendered
```

"Not tested" is useful information. It tells the next person what remains unknown.

---

## Before you reveal the first screen

Replace `App.tsx` with this code, but predict two things before saving:

1. Which words should appear?
2. Will the outer `View` display text if you remove the inner `Text`?

```tsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>POCKET PAUSE</Text>
      <Text style={styles.title}>Name five things you can see.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#eef6f2',
  },
  eyebrow: { marginBottom: 8, color: '#2f6654', fontSize: 14, fontWeight: '700' },
  title: { color: '#17352b', fontSize: 30, fontWeight: '700' },
});
```

Save. The phone should show two text lines. Account for each unfamiliar piece before changing it.

---

## First screen feedback: what should appear

The visible output is:

```text
POCKET PAUSE
Name five things you can see.
```

The second prediction has a different answer. Removing both `Text` wrappers and leaving a raw string under `View` causes a runtime error. The host cannot treat a layout child as a text node implicitly.

Do not memorize that as an isolated prohibition. The components announce different native responsibilities:

```text
View  -> layout container
Text  -> text layout and text accessibility
```

The next screens account for the syntax before you deliberately reproduce that failure.

---

## Read the imports as requests

```tsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
```

An **import** asks another module for exported values. The braces name particular exports. The quoted text names the package Metro must resolve.

`StatusBar` comes from an Expo package. `StyleSheet`, `Text`, and `View` come from React Native. They are JavaScript values by the time your component runs, even though some of them describe native-backed UI.

If you misspell `StyleSheet` as `Stylesheet`, TypeScript may flag the missing export in the editor and Metro will also be unable to build a valid module. That is different from misspelling a visible string, which builds successfully and produces the wrong words.

This gives you a useful distinction:

```text
wrong imported name -> module/type failure before useful execution
wrong displayed text -> valid execution, wrong product output
```

---

## Read the component boundary

```tsx
export default function App() {
  return (
    <View style={styles.screen}>
      <Text>...</Text>
    </View>
  );
}
```

`function App()` creates a named function. The capital `A` tells JSX that `<App />` refers to a component value rather than a lowercase host name.

`export default` makes this the module's main exported value. The blank template's entry code imports that default and asks React to render it.

`return` hands React the description for this render. The parentheses group a multiline expression. `<View>...</View>` describes one host component with children between its tags.

The braces in `style={styles.screen}` switch from JSX text to a JavaScript expression. React receives the value stored at `styles.screen`, not the letters `styles.screen`.

Nothing in this function manually calls Android drawing code. The host performs that work after React has calculated the description.

---

## Read every part of the screen

`View` groups and lays out content. It is not an HTML `div`. `Text` creates a native text node and is the supported home for visible text. `StyleSheet.create` groups named style objects and gives TypeScript a useful place to check property names and values.

`styles.screen` is an ordinary property read. The braces in `style={styles.screen}` mean, "evaluate this JavaScript expression and pass its value as the `style` prop."

`flex: 1` asks the root to fill available space. `justifyContent: 'center'` centers children along the main axis. The default main axis is vertical, so the group moves toward the vertical center. Day 6 derives layout in depth. Here the declarations only make the first screen easy to inspect.

`StatusBar` controls the system status-bar content style. It does not create safe spacing around cutouts. Safe areas belong to Day 4.

---

## A style object is data passed to a native component

This declaration does not behave like a CSS rule selected by a class name:

```tsx
const styles = StyleSheet.create({
  title: {
    color: '#17352b',
    fontSize: 30,
    fontWeight: '700',
  },
});
```

`StyleSheet.create` receives one object. Its `title` property contains another object describing supported React Native style values. Later, `style={styles.title}` passes that prepared style to `Text`.

There is no selector looking through a document for matching tags. The relationship is explicit:

```text
styles.title ---------------------> this Text's style prop
```

TypeScript can catch a misspelled property such as `fontSise`. It cannot decide whether a readable color choice fits the product. Types protect the shape of data, not the quality of the design.

Day 6 derives the layout system. Today, styles exist to make the host boundary observable without pretending that a few declarations are a layout education.

---

## `flex: 1` depends on available space

The root `View` fills the app's available content area because its parent offers space and `flex: 1` asks it to take that space.

This is not a universal command meaning "fill the phone." Put the same style on a child whose parent does not offer expandable space and the result can differ.

Likewise, `justifyContent: 'center'` does not mean "center everything in every direction." It positions children along the container's main axis. React Native's default main axis is vertical, so today's children move vertically toward the middle. Horizontal alignment is a separate decision.

The precise beginner-safe reading is:

```text
root has available vertical space
flex: 1 asks to occupy it
default main axis is vertical
justifyContent: 'center' centers children on that axis
```

You now know enough to understand this first screen. Day 6 owns the full layout model and its edge cases.

---

## Make the first failure useful

Test the earlier prediction by replacing the inner content:

```tsx
<View style={styles.screen}>
  Name five things you can see.
</View>
```

React Native reports that text strings need to be rendered inside `Text`. The error is not a style preference. The host needs to know whether it is creating a layout container or a text node. Browsers tolerate raw text inside many HTML containers; React Native makes the boundary explicit.

Repair it:

```tsx
<View style={styles.screen}>
  <Text>Name five things you can see.</Text>
</View>
```

> Visible strings belong inside `Text` because native layout containers and native text nodes have different jobs.

Day 2 tests the more surprising consequences of that rule.

---

## Fast Refresh is not permanent storage

Change the title string and save. In development, **Fast Refresh** usually updates the running app quickly while trying to preserve component state when safe.

"Usually" means some edits require a reload. "Trying to preserve" means Fast Refresh is a development convenience, not storage.

```text
save a text edit        -> Metro rebuilds changed code -> words update
reload the whole app    -> bundle starts again          -> memory restarts
close and reopen later  -> app starts again             -> no persistence exists
```

Day 3 introduces state. For now, remember that a quick refresh does not prove what a fresh launch will do.

---

## Hermes runs the JavaScript

React Native needs a JavaScript engine on the device. In this course's target stack, that engine is Hermes V1.

```text
Metro:  finds modules and serves the development bundle
Hermes: executes the JavaScript bundle on the device
React:  calculates the requested component tree
host:   commits native views
```

If Metro cannot resolve an import, the bundle is not ready. If JavaScript throws while running, Hermes reports a runtime problem. If the component returns valid but poor styles, the screen can render and still look wrong.

---

## Engine, runtime, React, and host are related but not identical

These words are often collapsed into "React Native," which makes error messages harder to place.

**Hermes is the engine.** It understands and executes JavaScript instructions.

**The runtime is the environment in which that JavaScript executes.** It includes the engine plus the capabilities made available around it. A browser runtime provides browser objects such as a document. The React Native runtime connects running JavaScript to React Native's supported platform capabilities instead of giving Android or iOS a browser DOM.

**React calculates component descriptions.** It calls `App` and follows the returned component tree.

**The native host commits supported host components.** It creates or updates the platform UI objects represented by `View`, `Text`, and the other native primitives.

```text
Metro output
   -> Hermes executes JavaScript inside the React Native runtime
   -> React calculates the requested component tree
   -> native host commits platform views
   -> operating system draws and handles them
```

The boundaries explain different failures:

- invalid JavaScript can fail while Hermes executes;
- an invalid component tree can fail while React or the host processes it;
- a valid tree can commit and still have a product or style mistake.

"Runtime error" therefore does not mean "Metro failed," and "screen looks wrong" does not mean "Hermes did not run."

```quiz
{
  "prompt": "Which pairing correctly separates two jobs in the development path?",
  "multiple": false,
  "options": [
    { "text": "Metro draws native views; Hermes edits TypeScript.", "correct": false },
    { "text": "Hermes serves QR codes; React installs Node.", "correct": false },
    { "text": "Expo Go writes source code; Metro controls pixels.", "correct": false },
    { "text": "Metro builds the bundle; Hermes executes its JavaScript.", "correct": true }
  ],
  "explanation": "Metro prepares and serves modules. Hermes is the engine that runs the resulting JavaScript on device."
}
```

---

## Use DevTools to answer a question

With the development server focused, press `j` to open React Native DevTools when that shortcut is available. Locate `App`, `View`, and the two `Text` children.

Verify this prediction:

```text
The component tree contains React Native components,
not an HTML body containing div and p elements.
```

Add this as the first statement inside `App`:

```tsx
console.log('App calculated a screen');
```

Save and watch the console. The log proves React called `App`; it does not prove the user pressed anything. Development checks can cause extra calculations, so avoid turning an exact log count into a rule.

---

## Android, iOS, and web are three observations

Use the Expo terminal's offered commands for environments available on your computer. A physical phone is still required evidence for the mobile workflow.

| Target | What to observe |
|---|---|
| Android | native screen opens, both lines are readable |
| iOS | native screen opens, both lines are readable |
| web | browser renders the shared components through a web host |

Web support does not turn the mobile app into HTML. It means the component source can target another supported host.

If you have only one mobile platform today, state that limitation. Do not convert an untested target into a passing result.

---

## Diagnose by the last stage that succeeded

```text
node/npm command fails
  -> tool installation or shell path

project starts, no device request appears
  -> device-to-server connection

device requests bundle, Metro shows unresolved import
  -> file path or package resolution

bundle loads, red runtime error appears
  -> executing component code

screen appears, spacing or text is wrong
  -> component tree or styles
```

Clearing caches is not first because it erases evidence without identifying a cause. Reset only after the symptom points toward stale generated state and you have recorded the original error.

```quiz
{
  "prompt": "Metro cannot resolve an import from `App.tsx`. What is the best first investigation?",
  "multiple": false,
  "options": [
    { "text": "Check the import spelling, path, and installed package.", "correct": true },
    { "text": "Change the phone's text size.", "correct": false },
    { "text": "Rewrite the screen with HTML tags.", "correct": false },
    { "text": "Assume the native view hierarchy is wrong.", "correct": false }
  ],
  "explanation": "An unresolved import occurs while Metro follows modules. Start at that stage instead of changing unrelated UI code."
}
```

---

## Practice: prove the path yourself

Do these in order. Keep the feedback screen closed until you have written a prediction or produced a run result. The point is not to accumulate screenshots. It is to produce evidence at progressively less supported levels.

### Tier 1: label the path

Create the blank TypeScript project and make Pocket Pause appear on a physical device. Copy this trace and replace every question mark with a job, not a product name:

```text
App.tsx
  -> Metro: ?
  -> Hermes: ?
  -> React: ?
  -> native host: ?
  -> operating system: ?
```

Then point at the exact observation that proves each completed stage. A memorized arrow with no observation is not yet a diagnosis skill.

### Tier 2: reconstruct without the screen open

Close the lecture. Write an `App` that imports `View`, `Text`, and `StyleSheet`, centers one message, and gives the screen a background color.

Before running, mark which line defines the component, which line returns JSX, and which value reaches the `style` prop. Then run it. If it fails, record the first error before reopening the answer.

---

### Tier 3: run two deliberate failures

First, make one local import path invalid. Predict which stages never begin. Save, capture the first error, and repair it.

Second, place a raw string directly under `View`. Predict why Metro can still finish while the runtime rejects the tree. Save, capture that different error, and repair it.

Your explanation must distinguish **could not produce executable output** from **executed code produced an invalid native description**.

---

### Tier 4: changed-task transfer

Build a "Before You Leave" screen with a title and three reminders. Do not copy Pocket Pause's wording, colors, or spacing values.

Constraints:

- use only `View`, `Text`, `StyleSheet`, and the already-created Expo project;
- keep every visible string inside `Text`;
- make the three reminders visually distinguishable without using a browser tag or CSS file;
- prove the result on one mobile target and web, recording those as separate observations.

---

### Tier 5: diagnose before touching code

For each symptom, write the next check and why it is the cheapest discriminating check:

1. `node --version` says the command is missing.
2. Metro is ready, but scanning the QR code produces no request.
3. Metro reports it cannot find `./Reminder`.
4. The device shows a red screen naming a raw text child.
5. The screen renders, but the title is not centered.

Record each tier as **with help**, **independent once**, **recalled after a delay**, or **transferred**. Finishing the guided tier does not establish the later statuses.

---

## Practice feedback: what strong evidence looks like

Reveal this only after attempting the tiers.

The completed path is:

```text
App.tsx
  -> Metro: resolves and transforms the imported module graph
  -> Hermes: executes the JavaScript on the device
  -> React: calls components and calculates a UI description
  -> native host: commits supported native views
  -> operating system: measures, draws, and handles those views
```

The two deliberate failures should separate cleanly:

```text
bad import
  Metro cannot finish the module graph
  -> Hermes receives no useful new bundle
  -> React does not calculate the intended screen

raw string under View
  Metro can build valid JavaScript
  -> Hermes runs it
  -> React Native rejects the host-child relationship
```

For the symptom set, the first checks are respectively: local Node installation or shell path; phone-to-server reachability; import spelling and file existence; the component tree around the named raw string; and the style values plus the parent space offered to the root.

A strong transfer result contains source, a mobile observation, a web observation, and one sentence explaining why web success does not prove the mobile host.

---

## Review queue

Add at most two prompts:

1. Draw the path from `App.tsx` to a native view and name Metro, Hermes, React, and the host's job.
2. Given a symptom, identify the last successful stage and choose the next check.

Try them about 1, 3, 7, 14, and 30 days after study, adapting to results. Keep daily review near 15 to 20 minutes.

---

## Common mistakes

| Symptom | Mistaken model | Better next move |
|---|---|---|
| Writing `div` or `p` | assuming a browser DOM | choose a React Native host component |
| Metro ready, phone blank | treating server readiness as device success | inspect connection and requests |
| Raw words under `View` | treating layout as text | wrap visible words in `Text` |
| Random cache resets | treating every failure as stale tooling | locate the failing stage |
| Web passed, mobile untested | treating one host as proof for all | record each target separately |

---

## Cheat sheet

```text
source       App.tsx and imports
Metro        follows modules and serves a bundle
Hermes       executes JavaScript on device
React        calculates the requested tree
native host  commits platform views
Expo Go      prebuilt native development host
Fast Refresh speeds edits; it is not persistence
```

---

## Tomorrow

One `View` and two `Text` nodes prove the path. They are not yet a reusable content card.

Tomorrow the screen gains images, scrolling, typed inputs, and a pressable action without importing browser assumptions or copying the card whenever content changes.

```finalquiz
{
  "title": "Day 1: React Native Mental Model & Expo SDK 57 Setup",
  "questions": [
    {"id":"q1","type":"single_correct","prompt":"What does React Native create on Android and iOS for core components?","codeSnippet":null,"options":[{"id":"a","text":"A hidden browser DOM"},{"id":"b","text":"Static screenshots"},{"id":"c","text":"Platform native views"},{"id":"d","text":"Markdown nodes"}],"correctOptionIds":["c"],"explanation":"The native host commits platform views. A browser DOM is the web host's target.","example":"`View` participates in the native hierarchy on a phone."},
    {"id":"q2","type":"single_correct","prompt":"Why does raw visible text directly inside `View` fail?","codeSnippet":null,"options":[{"id":"a","text":"A layout container is not the native text host"},{"id":"b","text":"Strings are forbidden in TypeScript"},{"id":"c","text":"Metro supports images only"},{"id":"d","text":"The phone needs a CSS reset"}],"correctOptionIds":["a"],"explanation":"React Native distinguishes layout containers from text nodes, so visible strings belong in `Text`.","example":"`<View><Text>Hello</Text></View>` gives each component one job."},
    {"id":"q3","type":"multiple_correct","prompt":"Which statements describe Metro in this workflow?","codeSnippet":null,"options":[{"id":"a","text":"It draws final native pixels"},{"id":"b","text":"It follows imported modules"},{"id":"c","text":"It serves the development bundle"},{"id":"d","text":"It is the phone's operating system"}],"correctOptionIds":["b","c"],"explanation":"Metro resolves modules and serves the bundle. The platform draws native UI.","example":"A misspelled import is reported while Metro builds the module graph."},
    {"id":"q4","type":"single_correct","prompt":"What is Hermes responsible for in the target stack?","codeSnippet":null,"options":[{"id":"a","text":"Installing Node"},{"id":"b","text":"Creating the project folder"},{"id":"c","text":"Scanning the QR code"},{"id":"d","text":"Executing JavaScript on device"}],"correctOptionIds":["d"],"explanation":"Hermes is the JavaScript engine. It runs code after a bundle is available.","example":"A runtime exception occurs while bundled code executes."},
    {"id":"q5","type":"single_correct","prompt":"Metro is ready, but the phone never requests the bundle. What should you inspect first?","codeSnippet":null,"options":[{"id":"a","text":"The title's font weight"},{"id":"b","text":"The device-to-server connection"},{"id":"c","text":"Future state logic"},{"id":"d","text":"The web DOM"}],"correctOptionIds":["b"],"explanation":"The server stage succeeded, so investigate the connection before changing screen code.","example":"Guest Wi-Fi may block the phone from reaching the computer."},
    {"id":"q6","type":"multiple_correct","prompt":"What does Fast Refresh justify during development?","codeSnippet":null,"options":[{"id":"a","text":"Source edits can often appear quickly"},{"id":"b","text":"All state survives every edit"},{"id":"c","text":"Data is permanently stored"},{"id":"d","text":"A fresh launch still needs separate testing"}],"correctOptionIds":["a","d"],"explanation":"Fast Refresh shortens the edit loop, but preservation is conditional and it is not storage.","example":"After a quick edit passes, reload to observe a fresh start."},
    {"id":"q7","type":"single_correct","prompt":"Why use the blank TypeScript template on Day 1?","codeSnippet":null,"options":[{"id":"a","text":"It disables native rendering"},{"id":"b","text":"It replaces npm"},{"id":"c","text":"It keeps one clear `App.tsx` entry with type checks"},{"id":"d","text":"It teaches routing first"}],"correctOptionIds":["c"],"explanation":"The template gives the launch lesson one obvious entry file without borrowing routing.","example":"The first screen can be understood by reading `App.tsx` top to bottom."},
    {"id":"q8","type":"single_correct","prompt":"What does a successful web run prove about Android?","codeSnippet":null,"options":[{"id":"a","text":"Android needs no test"},{"id":"b","text":"Native conventions are identical"},{"id":"c","text":"The app is release-ready"},{"id":"d","text":"Shared source works on web; Android still needs its own test"}],"correctOptionIds":["d"],"explanation":"Web uses a different host. Its success does not replace a mobile run.","example":"Record web and device results separately."},
    {"id":"q9","type":"multiple_correct","prompt":"Which observations point to distinct failing stages?","codeSnippet":null,"options":[{"id":"a","text":"`node` missing points to local setup"},{"id":"b","text":"An unresolved import points to Metro"},{"id":"c","text":"Wrong spacing points to tree or styles"},{"id":"d","text":"Every symptom requires a cache reset"}],"correctOptionIds":["a","b","c"],"explanation":"The first three locate distinct stages. A cache reset is not a diagnosis.","example":"Start from the last stage with evidence of success."},
    {"id":"q10","type":"single_correct","prompt":"Which trace best represents the Day 1 render path?","codeSnippet":null,"options":[{"id":"a","text":"`App.tsx` -> HTML -> screenshot"},{"id":"b","text":"`App.tsx` -> Metro -> Hermes -> React description -> native host"},{"id":"c","text":"Expo Go -> CSS -> Node -> DOM"},{"id":"d","text":"TypeScript -> app store -> view"}],"correctOptionIds":["b"],"explanation":"Source is bundled, executed, calculated by React, and committed through the native host.","example":"Each arrow gives you a stage to inspect."}
  ]
}
```
