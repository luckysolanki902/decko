# Day 3: CSS Foundations — Selectors, Color, Text, Units

**Duration: 4 hours | Focus: Turn semantic HTML into a readable bulletin by tracing how the browser chooses styles**

## Why this day exists

The equipment desk works, but every fact has nearly the same visual weight.

An urgent closure looks like an ordinary note. A link looks easy to miss. Long instructions spread until reading becomes tiring.

The HTML already says what each piece means. Today you will help a reader see that meaning quickly, without replacing the structure that made the page useful.

---

## The quick fix that becomes a maintenance trap

You can style one heading directly:

```html
<h1 style="color: red; font-size: 40px;">Red Line disruption</h1>
```

It works. Then the page gains six notices, each with copied declarations. Changing the warning color means finding every copy. One missed heading disagrees with the rest.

The problem is not that inline CSS is fake CSS. It is that the decision is trapped on one element and hard to reuse or compare.

We need rules that can target meaningful groups from one place.

---

## The mental model: choose, describe, resolve, paint

```text
HTML element
    ↓
selectors choose whether a rule matches
    ↓
declarations propose property values
    ↓
cascade resolves competing proposals
    ↓
browser computes values and paints
```

CSS means Cascading Style Sheets. A style sheet is a set of rules. The cascade is the conflict-resolution process, not a synonym for inheritance.

A styling bug usually belongs to one of four questions:

1. Did the stylesheet load?
2. Did the selector match?
3. Did another declaration win?
4. Is the property or value valid and visible here?

This four-question map is more useful than randomly adding stronger rules.

The browser repeats that pipeline for every element and every property. A selector does not “carry” a style into the element permanently. It contributes a proposal. The browser gathers all applicable proposals, resolves them, computes a final value, and paints from that result.

That is why deleting one rule can reveal another rather than returning immediately to a browser default. The lower-priority proposal was already there; it had been losing.

---

## Before the stylesheet: predict three failure fingerprints

Write what you expect to observe in each case before trying it:

1. `href="style.css"`, but the file is named `styles.css`
2. `.urgent` in CSS, but the HTML says `class="urgnet"`
3. `color: #8b1e2d` with the semicolon missing before the next declaration

Write one observable browser or DevTools symptom for each. Feedback follows on the next screen.

---

## Failure fingerprint feedback

```text
wrong path       stylesheet request fails; none of its rules can participate
wrong class      file loads, but that selector has no matching element
broken syntax    file and selector may be present, but a declaration is discarded
```

These are different boundaries. Adding `!important` cannot make a missing file load, cannot repair a spelling mismatch, and cannot make invalid syntax valid.

---

## Attach CSS three ways, then choose the maintainable one

Inline CSS lives on one element:

```html
<h1 style="color: #8b1e2d;">Red Line disruption</h1>
```

Internal CSS lives in `head` and affects one document:

```html
<style>
  h1 { color: #8b1e2d; }
</style>
```

External CSS lives in a separate file and can serve many pages:

```html
<link rel="stylesheet" href="styles.css">
```

```css
h1 {
  color: #8b1e2d;
}
```

`rel="stylesheet"` tells the browser what relationship the linked file has to the document. `href` locates it using the same path rules as yesterday.

External CSS usually wins as an authoring choice because one rule can be reused and reviewed centrally, not because external declarations automatically defeat every inline declaration in the cascade.

---

## Follow one external rule from file to pixels

Assume this project tree:

```text
bulletin/
├── index.html
└── styles.css
```

The link in `head` asks the browser to fetch a related stylesheet:

```html
<link rel="stylesheet" href="styles.css">
```

Trace one page load:

```text
browser parses the link
  → resolves styles.css beside index.html
  → requests and parses the CSS file
  → matches its selectors against the DOM
  → resolves declarations per property
  → paints the result
```

If the Network panel shows `styles.css` with a 404 status, stop at path resolution. If it loads but `.alert` does not appear in the Styles pane for the article, stop at selector matching. The observable stage tells you where to debug.

Internal CSS is useful for a single isolated document or a quick experiment. Inline CSS is useful for a narrowly generated value in some applications. Neither is “not real CSS.” External files are the course default because reuse and review matter as a site grows.

---

## The Network panel answers whether the browser received the file

Day 1 used the Elements panel to inspect the live document tree. CSS adds a second debugging question: did the browser successfully request the stylesheet?

Open DevTools, choose Network, reload the page, and filter for `CSS`. Each row represents a resource request. Click `styles.css` and inspect its status:

```text
200-style success status  → the browser received a response for that path
404                       → nothing was found at that path
no styles.css row         → the document may not contain the expected link
```

A successful response proves that bytes arrived. It does not prove your selector matched or your declaration won. A 404 proves that selector edits are premature because the browser never received the file.

Reload while Network is open because the panel observes requests as they happen. If the browser uses an older cached copy during debugging, enable the panel's cache-disabling option for the reload, then turn it back off when finished.

---

## A rule has a chooser and a description

```css
.alert {
  color: #651b25;
  background-color: #fff0f2;
}
```

`.alert` is the selector. It chooses elements whose `class` list contains `alert`.

Inside braces, each declaration contains a property, a colon, a value, and a semicolon. `color` affects foreground text; `background-color` paints behind it.

Apply the class in HTML:

```html
<article class="alert">
  <h2>Red Line disruption</h2>
  <p>Use bus route 18 between Central and Park.</p>
</article>
```

If nothing changes, inspect the element in DevTools. Confirm the class spelling, stylesheet path, and whether the rule appears in the Styles pane.

---

## The declaration block is parsed property by property

Read this character by character:

```css
.alert {
  color: #651b25;
  background-color: #fff0f2;
}
```

The selector ends before `{`. The braces contain declarations. Each declaration has a property name, a colon, a value, and usually a semicolon that separates it from the next declaration.

CSS is designed to recover from unfamiliar or invalid declarations. If the browser does not understand one property or value, it can discard that declaration and continue:

```css
.alert {
  color: #651b25;
  background-color: not-a-color;
  font-weight: 700;
}
```

The invalid background does not make the entire rule disappear. The color and weight can still apply. This resilience lets new CSS features coexist with older browsers, but it also means a typo may fail quietly. DevTools crosses out or warns about invalid values, so inspect the exact property instead of assuming the whole file is broken.

---

## Predict which selectors match

Given this HTML:

```html
<article id="red-line" class="alert urgent">
  <h2>Red Line disruption</h2>
  <a href="status.html">Live status</a>
</article>
```

Before continuing, list which element each selector chooses:

```css
article { ... }
.urgent { ... }
#red-line { ... }
[href] { ... }
article, a { ... }
```

Feedback comes next.

---

## Four direct selectors and one grouping tool

`article` matches every `article` element. `.urgent` matches any element carrying that class. `#red-line` matches the element with that unique ID. `[href]` matches any element possessing an `href` attribute.

`article, a` is a selector list: it applies the same declaration block to matches from either selector.

Classes are the ordinary reusable styling hook. IDs are valid selectors, but their uniqueness and high conflict weight make them awkward as the default styling tool. An attribute selector is useful when the attribute itself expresses a real state or kind:

```css
input[required] {
  border-color: #8b1e2d;
}

a[href^="https://"] {
  text-decoration-style: dotted;
}
```

`^=` means the attribute value starts with the given text.

---

## Classes describe reusable roles; IDs identify one document target

The first bulletin contains one urgent notice, so this appears to work:

```html
<article id="urgent">...</article>
```

```css
#urgent {
  color: #651b25;
}
```

Then the service adds a second urgent notice. An ID must remain unique, so copying `id="urgent"` makes the document relationship ambiguous. Inventing `urgent-two` forces a new selector even though the styling role is the same.

The reusable role belongs in a class:

```html
<article class="notice urgent">...</article>
<article class="notice urgent">...</article>
```

```css
.urgent {
  color: #651b25;
}
```

One element may carry several classes separated by spaces. Here `notice` can provide the shared notice treatment while `urgent` adds the severity treatment. Class names should describe roles or states that survive a redesign, not accidental coordinates such as `red-left-box`.

IDs still have a job: unique fragment targets, label relationships, and unique document identities. “Prefer classes for reusable styling” is not “IDs are forbidden.”

---

## Attribute selectors should follow real attributes

From yesterday's form:

```html
<input id="email" name="email" type="email" required>
<input id="note" name="note" type="text">
```

This selector chooses exactly the controls whose existing HTML contract says a value is required:

```css
input[required] {
  background-color: #fff8e6;
}
```

The brackets mean “has this attribute.” Add a value to ask for an exact attribute value:

```css
input[type="email"] {
  color: #20242a;
}
```

`[href^="https://"]` uses `^=` to mean “value starts with.” Related operators include `$=` for “ends with” and `*=` for “contains,” but reach for them only when the attribute pattern itself is meaningful. A clever substring selector tied to a filename can break when content changes.

---

```quiz
{
  "prompt": "The HTML is `<article class=\"alert urgent\">`. Which selectors match it directly?",
  "multiple": true,
  "options": [
    { "text": "`article`", "correct": true },
    { "text": "`.urgent`", "correct": true },
    { "text": "`#urgent`", "correct": false },
    { "text": "`[href]`", "correct": false }
  ],
  "explanation": "The element has the `article` tag and `urgent` class. It has neither an ID named urgent nor an href attribute."
}
```

---

## Descendants are not the same as direct children

```html
<nav class="primary-nav">
  <ul>
    <li><a href="status.html">Status</a></li>
  </ul>
</nav>
```

`.primary-nav a` matches an anchor anywhere inside the navigation, even through `ul` and `li`.

`.primary-nav > a` matches only anchors whose immediate parent is the navigation. It does not match the shown anchor.

Sibling combinators move sideways:

```css
h2 + p { margin-top: 0; }
h2 ~ p { color: #3f4650; }
```

`+` selects the next matching sibling only. `~` selects later matching siblings sharing the same parent.

Use the narrowest relationship that expresses the real structure, but avoid selectors so dependent on exact nesting that harmless HTML changes break them.

---

## Predict a combinator after the HTML gains one wrapper

Start here:

```html
<nav class="primary-nav">
  <a href="status.html">Status</a>
</nav>
```

Both `.primary-nav a` and `.primary-nav > a` match because the anchor is both a descendant and a direct child.

Now add a semantic list:

```html
<nav class="primary-nav">
  <ul>
    <li><a href="status.html">Status</a></li>
  </ul>
</nav>
```

The descendant selector still matches. The child selector stops matching because the anchor's immediate parent is now `li`.

That is not a browser quirk. The selector expressed a stronger relationship than the new tree satisfies. Use a child combinator when “immediate child” is part of the component contract. Use a descendant when harmless wrappers should not matter.

Sibling selectors never search inside an element. `h2 + p` asks for the next sibling paragraph after an `h2`; `h2 ~ p` asks for later sibling paragraphs under the same parent. Draw the parent and children before debugging sideways relationships.

---

## State and position selectors answer different questions

```css
a:hover { color: #8b1e2d; }
a:focus { outline: 3px solid #f5a623; }
a:active { color: #4b1018; }
li:first-child { font-weight: 700; }
li:last-child { margin-bottom: 0; }
li:nth-child(odd) { background-color: #f7f8fa; }
.notice:not(.urgent) { opacity: 0.8; }
```

`:hover` means a pointing device is over the element. `:focus` means it currently receives keyboard or similar input. Never rely on hover alone because touch and keyboard users may not produce it.

`:active` is the brief activation state while a link or button is being pressed.

`:first-child`, `:last-child`, and `:nth-child()` depend on sibling position, not class order. `:not()` matches elements that fail its inner selector.

An outline is valuable focus feedback. Removing it without an equally visible replacement hides the user's location.

---

## Hover works, then the keyboard exposes the missing state

This first attempt is common:

```css
a:hover {
  color: #8b1e2d;
}
```

It works with a mouse. Now press Tab until the link receives keyboard focus. If no focus style is visible, the interaction is only discoverable to the pointer path you happened to test.

Add focus feedback for the actual state:

```css
a:focus {
  outline: 3px solid #f5a623;
}
```

`:hover`, `:focus`, and `:active` are not a timeline every device must produce. A touchscreen may not have persistent hover. Keyboard focus can move without a mouse. Active is the brief activation moment. Style states from the interactions that genuinely exist, and test them with those inputs.

Position selectors have a different basis. `li:nth-child(odd)` asks about the element's position among all element siblings. It does not mean “every odd list item of this class” if other sibling element types are mixed in. Inspect the actual sibling list when a stripe lands on an unexpected row.

---

## The cascade exists because several rules can be true

All three declarations match the heading:

```html
<h2 id="service-title" class="notice-title">Service update</h2>
```

```css
h2 { color: navy; }
.notice-title { color: darkred; }
#service-title { color: purple; }
```

The browser needs one computed `color`. It considers origin and importance, then selector specificity, then source order when competing declarations remain tied.

For these ordinary author rules, the ID selector is more specific than the class, which is more specific than the element selector. Purple wins.

Do not turn that into “IDs are better.” High specificity makes later overrides harder. Classes usually create a more manageable system.

---

## The obvious override fails, then the cascade explains why

Suppose the base stylesheet contains:

```css
#service-title {
  color: purple;
}
```

Later you add what looks like an override:

```css
.notice-title {
  color: teal;
}
```

It is later, both selectors match, and the heading stays purple. Source order only breaks a tie. It does not erase a specificity difference.

The tempting patch is:

```css
.notice-title {
  color: teal !important;
}
```

That makes this declaration important, so it can win over ordinary author declarations. But the next override may now need its own `!important`, and the stylesheet becomes an arms race.

The durable repair is to understand why the base rule was so strong. If the role is reusable, replace the ID styling hook with a class. Then ordinary class selectors can override one another predictably when their specificity ties.

> Use source order to choose between equally specific rules. Do not use it as a mental eraser for stronger selectors.

---

## Specificity is a comparison, not a mystery number

Compare selectors by three useful columns:

```text
selector                 IDs   classes/attributes/states   elements
h2                        0              0                    1
.notice-title             0              1                    0
article .notice-title     0              1                    1
#service-title            1              0                    0
```

Compare left to right. A value in an earlier column beats any count in a later column. If specificity ties, the declaration that appears later wins.

Inline declarations have their own strong position in author styling. `!important` changes the importance layer and can beat ordinary declarations, but frequent use creates an override contest. Use DevTools to discover why a rule lost before reaching for it.

---

## Trace one property through the cascade

The cascade resolves each property independently. Given:

```html
<h2 class="notice-title urgent">Service update</h2>
```

```css
h2 { color: navy; font-weight: 500; }
.notice-title { color: darkred; }
.urgent { font-weight: 800; }
```

Predict both computed values before reading on.

For `color`, `h2` proposes navy and `.notice-title` proposes dark red. The class is more specific, so dark red wins.

For `font-weight`, `h2` proposes 500 and `.urgent` proposes 800. The class is more specific, so 800 wins.

The browser does not choose one whole rule and discard the others. It resolves `color`, `font-weight`, and every other property separately. This is why DevTools shows some declarations active and others crossed out within the same rule.

For ordinary author styles, use this debugging order:

```text
importance → specificity → source order
```

The browser also has its own default stylesheet, and user preferences can participate. Today, author rules are the conflict you will create most often. The key is not memorizing every cascade layer at once; it is refusing to skip directly to source order.

---

```quiz
{
  "prompt": "These ordinary rules all match one heading. Which color wins?\n\n```css\nh2 { color: navy; }\n.notice-title { color: darkred; }\narticle .notice-title { color: teal; }\n```",
  "multiple": false,
  "options": [
    { "text": "Navy because element selectors load first", "correct": false },
    { "text": "Dark red because classes always beat combined selectors", "correct": false },
    { "text": "The browser averages the colors", "correct": false },
    { "text": "Teal because the combined selector is more specific", "correct": true }
  ],
  "explanation": "`article .notice-title` has one class contribution plus one element contribution, so it outranks the class-only and element-only selectors."
}
```

---

## Inheritance saves repetition but does not move every property

Set a text style on the body:

```css
body {
  color: #20242a;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  border: 4px solid #20242a;
}
```

Descendant text usually inherits `color`, `font-family`, and `line-height`. Descendants do not each receive the body's border. Text-related properties often inherit because consistent reading style is useful; box decoration usually does not because nested borders would be disastrous.

Inheritance supplies a value only when the element does not have a winning declaration of its own. The cascade resolves a property on each element; inheritance can then provide a parent-derived value.

Useful global keywords include `inherit` to request the parent's computed value, `initial` to request the property's defined initial value, and `unset` to behave like inherit for inherited properties and initial for others.

---

## Inheritance begins only after this element has no winner of its own

Consider this tree:

```html
<article class="notice">
  <h2>Blue Line closure</h2>
  <p class="exception">Use bus route 18.</p>
</article>
```

```css
.notice { color: #651b25; }
.exception { color: #005ea8; }
```

The heading has no matching `color` declaration of its own, so it can inherit the article's dark red. The paragraph has its own winning class declaration, so blue wins there instead. Inheritance did not “lose a specificity battle” against the parent. The child first resolved its own declarations; only a missing local value invited inheritance.

Now add a border to `.notice`. The heading does not receive a border because `border` is not inherited by default. If box decoration inherited automatically, nesting three elements would paint three unexpected borders.

Use `inherit` when you deliberately want a normally non-inherited property to copy the parent's computed value. Use `initial` when you need the specification's initial value, which is not always the same as a browser's visible default stylesheet.

---

## Color notation is a choice of model, not quality

All of these can express colors:

```css
.named { color: darkred; }
.hex { color: #8b1e2d; }
.rgb { color: rgb(139 30 45); }
.rgb-alpha { color: rgb(139 30 45 / 70%); }
.hsl { color: hsl(351 65% 33%); }
.oklch { color: oklch(42% 0.15 20); }
```

Named colors are readable but limited. Hex encodes red, green, and blue channels compactly. RGB writes those channels directly. HSL describes hue, saturation, and lightness in a familiar cylindrical model. OKLCH is designed so changes in lightness and chroma more closely track human perception.

No notation is automatically accessible. Contrast depends on the actual foreground-background pair and text size, not the spelling of the color.

---

## Choose a color model for the decision you are making

The formats are several coordinate systems for describing color, not a ladder from bad to good.

Hex and RGB directly encode red, green, and blue channels:

```css
.alert { color: #8b1e2d; }
.alert { color: rgb(139 30 45); }
```

Those two examples describe the same color. Hex is compact; RGB makes channels and optional alpha explicit.

HSL describes a hue angle plus saturation and lightness:

```css
.alert { color: hsl(351 65% 33%); }
```

It can feel convenient when varying a hue-based palette, but equal numeric lightness does not guarantee equal perceived lightness across hues.

OKLCH addresses that design problem more directly:

```css
.alert { color: oklch(42% 0.15 20); }
```

The first component is perceived lightness, the second is chroma, and the third is hue angle. It is useful for systematic modern palettes. It does not bypass contrast requirements or guarantee support in every legacy environment.

Named colors are readable for prototypes and tiny examples. Production palettes usually need deliberate values and meaningful custom-property names.

---

## Alpha and opacity affect different scopes

This fades the entire element as one composited result:

```css
.closed-notice {
  opacity: 0.55;
}
```

Its text, background, border, and children all fade. That can make text unnecessarily hard to read.

This makes only the background translucent:

```css
.closed-notice {
  color: #20242a;
  background-color: rgb(139 30 45 / 12%);
}
```

The foreground remains solid. Use alpha in the specific color when one painted layer should be translucent. Use `opacity` when the entire rendered element truly should fade.

Predict the layers before testing:

```text
opacity: 0.55 on article
  → background fades
  → border fades
  → heading and link fade
  → any child icon fades

background-color: rgb(139 30 45 / 12%)
  → only the background paint is translucent
  → text and child content keep their own opacity
```

If a disabled-looking card becomes hard to read, inspect whether opacity was applied to an ancestor. Increasing the child's text color cannot fully undo an ancestor's final compositing opacity.

---

## Background layers can communicate without becoming content

```css
.hero {
  background-color: #152238;
  background-image: linear-gradient(135deg, #152238, #8b1e2d);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: scroll;
}
```

Background images are decorative paint and have no `alt`. If an image carries information, keep it in HTML with `img`.

`position` chooses alignment, `size: cover` fills the box while possibly cropping, `repeat` controls tiling, and `attachment` controls whether the background scrolls with the element. The shorthand can combine layers, but longhands are easier while learning and debugging.

A radial gradient grows from a center; a linear gradient follows a line. Both are generated backgrounds, not separate image files.

---

## The background shorthand is compact after the longhands are understood

This longhand version makes each decision visible:

```css
.hero {
  background-color: #152238;
  background-image: url("images/station.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: scroll;
}
```

`background-color` is the fallback paint. `background-image` provides an image or generated gradient. `position` anchors it, `size` controls its rendered coverage, `repeat` decides whether it tiles, and `attachment` decides whether it moves with the element's scroll context.

`cover` enlarges the image until the background area is filled, which can crop edges. That tradeoff is acceptable for decorative atmosphere and dangerous for a diagram containing information. Informative media belongs in HTML, where `alt` can replace it and the complete image can remain available.

The shorthand can reset background subproperties you omit. While debugging, expand it into longhands so you can see which layer or default changed.

---

## Typography starts with a fallback plan

```css
body {
  font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

The browser tries each family from left to right. Names containing spaces need quotes. The generic family at the end gives the browser a category when earlier fonts are unavailable.

A remote font can fail or arrive late, so the fallback is not ceremonial. Google Fonts offers hosted files, while `@font-face` lets you declare a file you control:

```css
@font-face {
  font-family: "Bulletin Sans";
  src: url("fonts/bulletin-sans.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

`font-display: swap` allows fallback text first, then swaps when the font is ready. Use only weights and styles whose files you actually provide.

---

## A font request can fail and the page must remain readable

Suppose the first family, `Inter`, is unavailable:

```css
body {
  font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

The browser tries the next family. `system-ui` asks for the operating system's interface font. `-apple-system` and `"Segoe UI"` cover familiar platform choices, and `sans-serif` is the final generic category.

This fallback chain is why a font stack is a list rather than one preferred name. Test the failure by temporarily misspelling `Inter` in DevTools. The text should remain readable, even if line breaks shift slightly.

With `@font-face`, the family name is yours, `src` points to the actual font resource, `format` describes it, and weight/style descriptors tell the browser which face this file represents. Declaring weight 700 while providing only a 400 file can make the browser synthesize a heavier appearance. Supply the faces you rely on and inspect the rendered font in DevTools.

`font-display: swap` allows fallback text to appear instead of hiding text while the remote file loads. The later swap can change line lengths, so the fallback should be reasonably compatible rather than ceremonial.

---

## Type properties each control one reading variable

```css
body {
  font-size: 1rem;
  line-height: 1.6;
}

h1 {
  font-size: 2.25rem;
  font-weight: 750;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.eyebrow {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

`font-size` changes glyph scale. `font-weight` chooses stroke weight if the font supplies it. `font-style` commonly selects italic. Unitless `line-height` scales with each element's own font size, which makes inherited rhythm safer.

`letter-spacing` changes space between characters; `word-spacing` changes space between words. Large body text with tight line-height becomes tiring, while excessive tracking damages word shapes. Typography is a reading system, not a bag of decoration.

---

## Predict the computed line height, not only the written number

Unitless line height multiplies each element's own font size:

```css
body {
  font-size: 16px;
  line-height: 1.6;
}

h1 {
  font-size: 40px;
}
```

The body text uses a computed line height of about `25.6px`. The heading inherits the factor and computes about `64px` from its own size. That may be too loose for a large heading, so the heading can set a tighter local value such as `1.1`.

If the parent instead used `line-height: 25.6px`, descendants could inherit that fixed length. A 40px heading squeezed into 25.6px lines can collide. The unitless factor travels better because each descendant multiplies from its own font size.

`font-weight` selects an available face or a synthesized approximation. `font-style: italic` selects or simulates an italic face. `letter-spacing` changes character spacing and `word-spacing` changes spaces between words. Use small adjustments with a visible reading reason; large tracking on body prose breaks familiar word shapes.

---

## Text decoration and alignment must preserve meaning

```css
a {
  color: #005ea8;
  text-decoration: underline;
  text-decoration-thickness: 0.1em;
  text-underline-offset: 0.15em;
}

.notice-time {
  text-align: right;
  font-style: italic;
}
```

`text-align` aligns inline content within its container. It does not move the container itself. `text-decoration` adds lines such as underlines. Removing every link underline makes links harder to recognize unless another persistent cue remains.

`text-transform` changes presentation, not the source text. `text-indent` offsets the first line. These tools should support reading and hierarchy rather than disguise weak HTML.

---

## Text properties do not repair missing meaning

This CSS can make a paragraph resemble a heading:

```css
.fake-heading {
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
}
```

The page may look convincing, but the document still contains a paragraph. The heading outline from Day 1 has not changed. CSS controls presentation; it does not upgrade HTML semantics.

`text-align` positions inline content within the space its container provides. It does not move the container itself and it does not mean “center this whole component.”

`text-decoration` can add, remove, style, and offset lines. Because the default underline is a persistent link cue, removing it everywhere creates a recognition problem that a hover-only color change cannot repair.

`text-transform: uppercase` changes how letters are displayed, not the source text copied by tools or read by every assistive path. Write correct source words first; use transformation for a restrained visual convention such as a short eyebrow label.

`text-indent` moves the first line of a text block. It is not a general spacing tool and should not be used to hide text off-screen.

---

## Long text needs an explicit breaking policy

An unbroken service URL can overflow a narrow card:

```css
.notice {
  overflow-wrap: anywhere;
}
```

`white-space` controls collapsing and wrapping of spaces and line breaks. `word-break` controls how words may split; aggressive values can harm normal prose. `overflow-wrap: anywhere` allows a long otherwise-unbreakable token to wrap when necessary.

For one-line truncation:

```css
.route-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

All three parts matter: keep one line, hide overflow, then show the ellipsis. Truncation hides information, so use it only where the full value remains available elsewhere.

Multi-line clamping is a modern visual technique:

```css
.summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
```

It is suitable for previews, not for essential instructions.

---

## Wrapping and truncation solve different problems

Start with a long unbroken status address. It extends beyond the readable area. `overflow-wrap: anywhere` gives the browser extra legal break points, so all the information remains available on multiple lines.

Truncation makes a different trade:

```css
.route-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

`white-space: nowrap` prevents wrapping. `overflow: hidden` clips what no longer fits. `text-overflow: ellipsis` asks for the visible ellipsis marker. Remove any one and the result changes.

The ellipsis does not reveal the missing text by itself. If the full route name is necessary to choose safely, wrap it instead. If it is a compact preview that opens a full detail view, truncation can be honest.

`word-break` changes where words may split. Aggressive breaking can turn ordinary prose into difficult fragments, so prefer `overflow-wrap` for exceptional long tokens before applying broad word-breaking rules.

---

```quiz
{
  "prompt": "A card should keep fully opaque text while using a translucent red background. Which approach fits?",
  "multiple": false,
  "options": [
    { "text": "Set `opacity` on the whole card", "correct": false },
    { "text": "Use an alpha value in `background-color`", "correct": true },
    { "text": "Apply `visibility: hidden`", "correct": false },
    { "text": "Remove the foreground color", "correct": false }
  ],
  "explanation": "Background alpha affects that painted layer. Element opacity fades the text and descendants too."
}
```

---

## Units answer “relative to what?”

`px` is a CSS pixel, useful for thin borders and precise small details. It is not guaranteed to equal one hardware pixel.

`rem` is relative to the root element's font size. It gives a shared scale for type and spacing. `em` is relative to the current element's font size for most properties, so nested components can compound.

`%` depends on the property and containing context. `vw` and `vh` are percentages of viewport width and height; `vmin` and `vmax` use the smaller or larger viewport dimension. `ch` approximates the width of the `0` glyph and is useful for readable text measures.

```css
body { font-size: 1rem; }
.notice { max-width: 65ch; }
.notice { border-left: 4px solid #8b1e2d; }
```

Use `rem` as a dependable type scale, `ch` for line length, and `px` where a small fixed visual thickness is intentional. These are defaults for judgment, not laws that ban other choices.

---

## Predict relative units with concrete numbers

Assume the root font size is `16px` and the current element inherits that size:

```text
1rem      → 16px, because rem asks the root
1.5rem    → 24px
1em       → 16px here, because em asks the current element
2em       → 32px here
50vw      → half the viewport width
50vh      → half the viewport height
65ch      → roughly the width of 65 zero glyphs in this font
```

The number is incomplete until you know its reference. `%` is especially context-dependent: its reference depends on the property and containing context. Do not carry one percentage intuition into every property.

Viewport units are useful for values that truly follow the viewing area. They can be uncomfortable for body text because an extremely wide screen can produce extreme type. A unit being responsive does not guarantee a readable result.

`vmin` follows the smaller viewport dimension; `vmax` follows the larger. Rotate a phone and their references can switch. Predict that change before using them for anything essential.

---

## The `em` compounding failure

Suppose each nested list uses `font-size: 0.9em`:

```text
root list      1.000 × 0.9 = 0.900
nested list    0.900 × 0.9 = 0.810
third level    0.810 × 0.9 = 0.729
```

The shrinking is mathematically correct because each level is relative to its parent's computed size.

If all levels should use one shared size, use a root-relative value such as `0.9rem`. If a badge's padding should scale with that badge's own text, `em` is useful.

The diagnostic question is always “relative to what?” rather than “which relative unit is best?”

---

## Custom properties name decisions

Repeating a color works until the identity changes:

```css
:root {
  --color-danger: #8b1e2d;
  --color-danger-soft: #fff0f2;
  --measure-reading: 65ch;
}

.alert {
  color: var(--color-danger);
  background-color: var(--color-danger-soft);
  max-width: var(--measure-reading);
}
```

A custom property name begins with two hyphens. `:root` matches the document's root element, so descendants can inherit these values. `var()` reads one.

Name the role rather than the current appearance. `--color-danger` survives a palette change better than `--dark-red`.

Custom properties participate in the cascade. A component can override one value in its subtree without copying every declaration.

---

## A custom property is a value that still follows normal CSS rules

This local override changes only notices inside one region:

```css
:root {
  --color-danger: #8b1e2d;
}

.night-service {
  --color-danger: #ffb4bd;
}

.urgent {
  color: var(--color-danger);
}
```

The `.urgent` rule is unchanged. Inside `.night-service`, inheritance supplies the local custom-property value; elsewhere, the root value continues to apply. This is why custom properties are more than textual find-and-replace tokens: they participate in cascade and inheritance.

`var()` can carry a fallback for a missing variable:

```css
color: var(--color-link, #005ea8);
```

The fallback is used when `--color-link` is not defined or is invalid at substitution time. It does not activate merely because the chosen color has poor contrast. CSS cannot infer the design intent behind the value.

Name a decision such as `--color-danger` or `--measure-reading`, not an accidental current appearance such as `--red` or `--wide`. A role name can survive a theme change.

---

## Cursor is a promise about interaction

```css
a,
button {
  cursor: pointer;
}

input[type="text"] {
  cursor: text;
}

.map {
  cursor: grab;
}

button:disabled {
  cursor: not-allowed;
}
```

`pointer`, `text`, `grab`, and `not-allowed` suggest different actions. The cursor does not create the action. Applying `pointer` to a dead card falsely promises it can be activated.

Custom cursor URLs exist, but need a fallback and can reduce usability:

```css
.map {
  cursor: url("cursors/grab.cur"), grab;
}
```

Use familiar system cursors unless a custom image genuinely improves the task.

The fastest way to catch a dishonest cursor is to test the promised action. If a card uses `cursor: pointer`, activate it with a mouse and then try to reach and activate the same control with a keyboard. If nothing happens, the cursor is decoration pretending to be behavior.

`cursor: not-allowed` similarly does not disable anything. The HTML control state must express unavailability; the cursor can reinforce that state. Presentation should report interaction, not invent it.

---

## Debug CSS in a fixed order

When the urgent heading stays black:

1. In Network or Sources, confirm `styles.css` loaded from the intended path.
2. In Elements, confirm the HTML has the expected class or attribute.
3. In Styles, find the selector. If absent, it did not match or the file did not load.
4. If crossed out, inspect the winning declaration and compare importance, specificity, and order.
5. If active but visually ineffective, inspect the computed value and whether the property affects this element.
6. Check the console or editor for malformed braces, property names, and values.

This distinguishes “no proposal,” “lost proposal,” and “proposal has no visible effect.” Adding `!important` hides the diagnosis.

---

## Read DevTools evidence as a trace

Suppose the urgent heading is black. Inspect it and classify what you see.

### Case 1: no rule from `styles.css`

Open Network and reload. If `styles.css` is missing or has a 404 response, the browser never received the proposal. Repair the link path first.

### Case 2: stylesheet loaded, `.urgent` absent from Styles

The file exists, but this selector did not match this element. Compare the element's tag, classes, ID, attributes, and relationships with the selector. Check spelling and the DOM tree, not only the source indentation.

### Case 3: declaration is crossed out

The selector matched and the value parsed, but another declaration won. Click or inspect the winning declaration. Compare importance, specificity, then source order. This is a cascade problem, not a loading problem.

### Case 4: declaration is active but the result still looks wrong

Read the Computed pane. Confirm the final value and ask whether the property controls the feature you are observing. `text-align` being active will not move the container; `opacity` on an ancestor can still fade a child's active color.

### Case 5: declaration has a warning mark

The selector may match, but the property name or value is invalid. Correct the syntax. Making an invalid declaration important leaves it invalid.

This procedure turns “CSS is random” into five distinct, testable states.

---

```quiz
{
  "prompt": "A rule appears in DevTools but its declaration is crossed out. What should you inspect next?",
  "multiple": false,
  "options": [
    { "text": "The winning declaration and the cascade comparison", "correct": true },
    { "text": "Whether HTML supports any styles at all", "correct": false },
    { "text": "Whether the page has a form action", "correct": false },
    { "text": "Add several `!important` flags immediately", "correct": false }
  ],
  "explanation": "A crossed-out declaration matched but lost. DevTools shows the winner, letting you compare specificity, importance, and order."
}
```

---

## Hands-on build: Transit disruption bulletin

Start from semantic HTML with a page heading, current disruption article, affected-stop list, alternative-route links, update time, and secondary travel note.

Build an external stylesheet that provides:

1. A restrained severity palette with contextual custom-property names
2. A readable system font stack and a maximum reading measure
3. Clear heading and body hierarchy using `rem`, unitless line-height, weight, and spacing
4. Persistent link recognition plus hover and visible focus states
5. One descendant selector, one direct-child selector, and one attribute selector used for real structural reasons
6. A soft alert background using alpha without fading its text
7. Safe wrapping for an unusually long station name or URL
8. Honest cursors only on real interactions

Decision point: choose whether the update time should inherit body styling or receive a local class. Justify the choice from meaning and reuse, not from selector strength.

Test by temporarily adding a much longer route name and navigating every link with the keyboard.

---

## Changed task: style yesterday's loan desk

Without copying the bulletin selectors, style the form so labels, required controls, grouped choices, table headers, and action buttons remain easy to scan.

Choose selectors from the form's existing meaning. Do not add IDs just to gain specificity. Include a visible focus treatment and a narrow reading measure. Then introduce one deliberate conflict and use DevTools to explain exactly why one declaration wins.

---

## Common mistakes

| Mistake | Why it hurts | Better move |
|---|---|---|
| Fixing every element inline | Reuse and later changes become scattered | Link one external stylesheet |
| Styling mainly with IDs | Small overrides become specificity battles | Prefer reusable classes |
| Confusing cascade with inheritance | The wrong mechanism gets debugged | First resolve competitors, then consider inherited values |
| Removing focus outlines | Keyboard position disappears | Provide an equally visible focus style |
| Fading a card with `opacity` | Text and children fade too | Use alpha on the specific background color |
| Using background images for information | The content has no text replacement | Keep informative images in HTML |
| Truncating essential instructions | Readers lose required content | Wrap it or provide the full value |
| Adding `!important` before inspection | The underlying selector conflict remains | Use DevTools to identify the winner |
| Adding pointer cursor to dead UI | The page promises an action that does not exist | Match cursor to real behavior |

---

## Practice

Type and run all five. Write each prediction before using DevTools as feedback.

### Tier 1: retrieve the pipeline

1. **Reconstruct.** Closed notes, draw choose → describe → resolve → paint. Under each arrow, write one observable failure: missing file, unmatched selector, losing declaration, invalid value.

### Tier 2: predict and prove

2. **Match selectors.** Create one anchor carrying a tag, two classes, an ID, and `href`. Predict ten direct and relationship selectors as match or no match. Verify in DevTools and explain every disagreement from the DOM tree.

3. **Resolve a conflict.** Create two equal-specificity class rules and prove later source order wins. Then add an element selector to one side, predict again, and finally introduce an ID rule. Do not use `!important`.

4. **Trace units.** With a 16px root, calculate three levels of `font-size: 0.9em` before running them. Replace nested `em` with `0.9rem`, inspect the computed sizes, and explain why the second result no longer compounds.

### Tier 3: transfer the decisions

5. **Build and change.** Style a library closure notice with opaque text, translucent warning paint, a fallback font stack, readable line height, a wrapping URL, and visible hover and focus states. Then change the task to a quiet service advisory. Reuse role-based custom properties and decide which severity styles should change without rewriting the structural selectors.

Review later: reconstruct the four-question debugging map and resolve a changed cascade conflict. Track assisted, independent, delayed, and transferred evidence separately.

---

## Cheat sheet

```text
LOAD: <link rel="stylesheet" href="styles.css">
RULE: selector { property: value; }
SELECT: element, .class, #id, [attribute], selector list
RELATE: A B descendant, A > B child, A + B next, A ~ B later siblings
STATE: :hover, :focus, :active; POSITION: :first-child, :nth-child()
CASCADE: origin/importance → specificity → source order
INHERITANCE: common for text, uncommon for box decoration
COLOR: notation does not determine contrast
ALPHA: one color layer; OPACITY: whole rendered element
TYPE: fallback stack, rem scale, unitless line-height, readable measure
WRAP: overflow-wrap for long tokens; truncation hides information
UNITS: always ask “relative to what?”
TOKENS: --name: value; use with var(--name)
DEBUG: loaded? matched? lost? valid and visible?
```

---

## Tomorrow

The bulletin now has a clear reading hierarchy, but every element still occupies a rectangular box whose size includes more than the declared width. Tomorrow, spacing, borders, sizing, and overflow become predictable by tracing that box from content outward.

---

```finalquiz
{
  "title": "Day 3: CSS Foundations",
  "questions": [
    {"id":"q1","type":"single_correct","prompt":"What does the cascade do?","codeSnippet":null,"options":[{"id":"a","text":"Downloads HTML"},{"id":"b","text":"Creates form names"},{"id":"c","text":"Resolves competing declarations for a property"},{"id":"d","text":"Converts every element to a block"}],"correctOptionIds":["c"],"explanation":"Selectors can make several declarations applicable; the cascade determines the winning value.","example":"Three matching `color` proposals become one computed color."},
    {"id":"q2","type":"multiple_correct","prompt":"Which directly match `<a class=\"route urgent\" href=\"status.html\">`?","codeSnippet":null,"options":[{"id":"a","text":"`a`"},{"id":"b","text":"`.urgent`"},{"id":"c","text":"`[href]`"},{"id":"d","text":"`#route`"}],"correctOptionIds":["a","b","c"],"explanation":"The element has the tag, class, and attribute, but no ID named route.","example":"A class value is selected with a dot, not a hash."},
    {"id":"q3","type":"single_correct","prompt":"Which selector matches anchors anywhere inside `.primary-nav`?","codeSnippet":null,"options":[{"id":"a","text":"`.primary-nav + a`"},{"id":"b","text":"`.primary-nav a`"},{"id":"c","text":"`.primary-nav > a` only through any depth"},{"id":"d","text":"`.primary-nav ~ a`"}],"correctOptionIds":["b"],"explanation":"The space is the descendant combinator. The child combinator requires an immediate parent relationship.","example":"A nav's anchor may sit through `ul` and `li`."},
    {"id":"q4","type":"single_correct","prompt":"Two ordinary class selectors have equal specificity. What breaks the tie?","codeSnippet":null,"options":[{"id":"a","text":"Alphabetical property order"},{"id":"b","text":"The shorter class name"},{"id":"c","text":"The earlier HTML element"},{"id":"d","text":"Later source order"}],"correctOptionIds":["d"],"explanation":"When importance and specificity tie, the later declaration wins.","example":"Two `.alert` color rules tie; the later one wins."},
    {"id":"q5","type":"multiple_correct","prompt":"Which commonly inherit from a parent?","codeSnippet":null,"options":[{"id":"a","text":"`color`"},{"id":"b","text":"`font-family`"},{"id":"c","text":"A `line-height` that was explicitly reset on every child"},{"id":"d","text":"`border` on every descendant"}],"correctOptionIds":["a","b"],"explanation":"Text color and font family commonly inherit. An explicit child reset replaces inheritance, and box borders generally do not inherit.","example":"Set reading defaults on `body` without bordering every child."},
    {"id":"q6","type":"single_correct","prompt":"How do you keep text opaque over a translucent warning fill?","codeSnippet":null,"options":[{"id":"a","text":"Set the card's `opacity`"},{"id":"b","text":"Hide the text"},{"id":"c","text":"Use a background image for the text"},{"id":"d","text":"Use alpha in `background-color`"}],"correctOptionIds":["d"],"explanation":"Color alpha changes one painted layer; opacity fades the composed element and its children.","example":"`rgb(139 30 45 / 12%)` softens only the fill."},
    {"id":"q7","type":"multiple_correct","prompt":"Which improve readable typography?","codeSnippet":null,"options":[{"id":"a","text":"A fallback font stack"},{"id":"b","text":"Unitless line-height for scalable rhythm"},{"id":"c","text":"A bounded reading measure such as `65ch`"},{"id":"d","text":"Removing every persistent link cue"}],"correctOptionIds":["a","b","c"],"explanation":"Fallbacks, proportional line-height, and controlled line length support reading. Links still need persistent recognition.","example":"A system fallback keeps text usable before a web font arrives."},
    {"id":"q8","type":"single_correct","prompt":"Why can repeated `0.9em` font sizes shrink deeply nested lists?","codeSnippet":null,"options":[{"id":"a","text":"Borders subtract from fonts"},{"id":"b","text":"`em` is always equal to a viewport unit"},{"id":"c","text":"Browsers ignore root font size"},{"id":"d","text":"Each level is relative to its parent's computed size"}],"correctOptionIds":["d"],"explanation":"The relative multiplication repeats at each nested level, producing compounding.","example":"1 × 0.9 × 0.9 × 0.9 = 0.729."},
    {"id":"q9","type":"multiple_correct","prompt":"Which are responsible uses of CSS?","codeSnippet":null,"options":[{"id":"a","text":"Use `overflow-wrap` for a long unbroken URL"},{"id":"b","text":"Use background imagery for essential information"},{"id":"c","text":"Keep visible keyboard focus feedback"},{"id":"d","text":"Use cursor cues only when the interaction exists"}],"correctOptionIds":["a","c","d"],"explanation":"Wrapping, focus feedback, and honest interaction cues improve usability. Informative images belong in HTML with text alternatives.","example":"A pointer cursor cannot make a dead card clickable."},
    {"id":"q10","type":"single_correct","prompt":"A declaration is crossed out in DevTools. What does that prove?","codeSnippet":null,"options":[{"id":"a","text":"The stylesheet never loaded"},{"id":"b","text":"The selector matched, but another declaration won"},{"id":"c","text":"The HTML file is missing"},{"id":"d","text":"The property inherited successfully"}],"correctOptionIds":["b"],"explanation":"Crossed-out styling is applicable but defeated. Inspect the winning declaration and compare cascade factors.","example":"Matched but lost is different from never matched."}
  ]
}
```
