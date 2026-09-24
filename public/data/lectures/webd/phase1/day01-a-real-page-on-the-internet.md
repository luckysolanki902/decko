# Day 1: HTML Foundations — Your First Real Web Page

**Duration: 4 hours | Focus: Build, inspect, and publish a meaningful page using HTML alone**

## Why this day exists

A blank browser tab knows nothing about your repair cafe.

It cannot tell which words name the page, which image explains the venue, or which phone number should be callable.

You could paste all the words into one file. A person might guess the meaning. The browser cannot.

Today you will give the content a structure the browser understands, then put it at a public address.

---

## The readable page with no meaning

Create `repair-cafe/index.html` and paste this:

```html
Repair Cafe Saturday
Bring a broken lamp, toaster, or small fan.
10:00 to 14:00 at the Community Hall.
Email hello@example.com
```

It appears, so the attempt is not foolish. But the browser has no reliable answers to “which line is the main heading?” or “is the email an action?” Line breaks in the file are editing conveniences.

> HTML describes what content is and how its pieces relate. It does not decide how polished the page looks.

---

## The mental model: labelled containers

Loose objects in a moving van are hard to identify. Labelled boxes preserve meaning.

```text
document
├── information for the browser
└── content for the visitor
    ├── page heading
    ├── paragraph
    └── contact link
```

An element is a labelled container:

```html
<h1>Repair Cafe Saturday</h1>
<p>Bring one portable item.</p>
<a href="mailto:hello@example.com">Email the organisers</a>
```

The opening tag starts it, the closing tag ends it, and content sits between. `href` is an attribute: extra information that tells the link where to go.

The browser does not treat those labels as decoration. It reads the file from top to bottom and builds a tree in memory:

```text
bytes in index.html
        ↓ decoded as text
HTML tags and text
        ↓ parsed into relationships
document tree in memory
        ↓ drawn by the browser
pixels you can see
```

That in-memory tree is the **Document Object Model**, usually shortened to DOM. A model is a representation the browser can work with. The useful fact today is simple: the browser turns nested HTML into a nested tree.

If the source says a paragraph lives inside an article, the DOM records the paragraph as the article's child. Screen readers, search engines, browser features, and later JavaScript can use that relationship. They do not have to guess from how the pixels happen to look.

---

## First setup: make one edit travel all the way to the browser

Create a folder named `repair-cafe`, open that folder in VS Code, and create `index.html` inside it. The exact filename matters. When a server receives a request for a folder, `index.html` is the conventional file it looks for first.

Open the file through Live Server. Your address will look similar to this:

```text
http://127.0.0.1:5500/index.html
```

`127.0.0.1` means this computer. The number after the colon identifies the local server process. This is still not a public address. It is a convenient local route that lets the editor's server notice saved files and refresh the browser.

Make one controlled test:

1. Type `<h1>Repair Cafe Saturday</h1>`.
2. Save the file.
3. Watch the browser refresh.
4. Change `Saturday` to `Sunday`, save, and verify the visible word changes.

If it does not, stop before writing more HTML. Check the filename, confirm that VS Code opened the intended folder, and compare the browser address with the file you edited. A correct page in the wrong file is still invisible.

---

## Predict the two rooms

Place each item in `head` or `body` before continuing:

1. Text visible to the visitor
2. The browser-tab title
3. The instruction for decoding characters

```text
html
├── head: information about the page
└── body: content displayed in the page
```

Keep your answer. Feedback follows on the next screen.

---

## The complete document

Visible content belongs in `body`. The tab title and decoding instruction belong in `head`.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Repair Cafe Saturday</title>
    <meta name="description" content="Free community repair help this Saturday.">
  </head>
  <body>
    <h1>Repair Cafe Saturday</h1>
    <p>Bring one portable item.</p>
  </body>
</html>
```

`<!doctype html>` selects modern HTML rules. `<html lang="en">` wraps the document and names its primary language. `head` holds page information; `body` holds the page.

`charset="UTF-8"` makes character decoding explicit instead of trusting a browser guess. The viewport instruction prevents a phone from pretending it has a wide desktop screen and shrinking the page.

`meta` is a void element. Its attributes contain its information, so it wraps no content and has no closing tag.

---

## Read the document from the outside inward

The complete example contains several unfamiliar pieces. Give each one one job before adding more content.

```html
<!doctype html>
<html lang="en">
  <head>...</head>
  <body>...</body>
</html>
```

`<!doctype html>` is a declaration to the browser, not a visible element. It asks for the modern HTML interpretation rules. Without it, browsers may enter a compatibility mode created for very old pages. The page may still look fine until later rules expose the difference, which makes the omission hard to diagnose.

`html` is the root element: every visible element and every piece of page information sits inside it. `lang="en"` says the primary language is English. A screen reader can use that signal to choose pronunciation, and translation tools can make a better first decision. Change the value when the page's primary language changes; do not copy `en` blindly.

`head` contains information *about* the document. `body` contains the document presented to the visitor. The tab title is about the page, so it belongs in `head`; the visible `h1` is part of the page, so it belongs in `body`.

---

## Character decoding fails as wrong text, not as a blank page

A file is stored as bytes. The browser needs a decoding rule to turn those bytes into characters. UTF-8 is the standard rule capable of representing text from many writing systems.

Without an early declaration, the browser may guess. A wrong guess can produce **mojibake**, text such as `cafÃ©` where the author wrote `café`. The HTML structure still exists, so the failure can look like bad content rather than a document-level decoding mistake.

Put the declaration near the start of `head`:

```html
<meta charset="UTF-8">
```

`meta` means information about the document. `charset` names the character set used to decode it. There is no visible content to wrap, so this is a void element.

The useful debugging distinction is:

```text
one word was typed incorrectly       → inspect the source text
many accented or non-Latin characters are corrupted → inspect decoding
```

The declaration cannot repair a file already saved with the wrong character encoding. The editor and browser need to agree on UTF-8.

---

## A phone should use its real viewing width

Before responsive CSS exists, the browser still needs to know how to interpret the page on a phone. Historically, mobile browsers pretended pages had a wider desktop-like viewport, then shrank the result to fit. That kept old desktop sites visible but made ordinary text tiny.

This metadata changes that starting assumption:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

`name="viewport"` identifies which browser setting this metadata describes. Inside `content`, `width=device-width` says the layout viewport should follow the device's available width. `initial-scale=1.0` asks for a normal initial zoom scale.

The line does not make a page responsive by itself. A wide image or future fixed-width layout can still overflow. It gives the browser an honest coordinate system so later responsive rules operate on the real viewing width instead of a simulated desktop width.

Test the effect in DevTools device mode: temporarily remove the line, reload, and compare the apparent scale. Restore it before continuing.

---

## The tab title and the page heading answer different questions

These two lines often contain similar words, but they are not duplicates:

```html
<title>Repair Cafe Saturday | Riverside Community Hall</title>
<h1>Repair Cafe Saturday</h1>
```

`title` answers “what should identify this page in a browser tab, bookmark, or search result?” It lives in `head` and is not ordinary page content.

`h1` answers “what is the subject of the content I am reading?” It lives in `body` and appears on the page.

Try the failure: delete `title`, save, and inspect the tab. The document still renders, but the browser falls back to a filename or address. Restore it. A visible heading does not excuse a missing tab title.

The description metadata is a short summary that search engines and sharing tools may choose to show:

```html
<meta
  name="description"
  content="Free community repair help for portable household items this Saturday."
>
```

It does not force a search engine to display that sentence, and it does not become visible body text. Write it as an honest summary, not a pile of repeated keywords.

---

## Tags, elements, and attributes are related but not identical

Look at one link:

```html
<a href="mailto:hello@example.com">Email the organisers</a>
```

The opening tag is `<a href="mailto:hello@example.com">`. The closing tag is `</a>`. The element is the whole unit: opening tag, content, and closing tag.

`href="mailto:hello@example.com"` is an attribute. The attribute name is `href`; the quoted attribute value is `mailto:hello@example.com`. Attributes configure or describe an element. They live in the opening tag, not between the tags.

Now compare a void element:

```html
<meta charset="UTF-8">
<img src="images/hall.jpg" alt="Brick entrance beside the library">
<br>
```

A void element cannot contain child content, so it has no closing tag. Writing `<img>photo</img>` does not turn `photo` into the image's content. The replacement text belongs in `alt`, because that is the contract the `img` element defines.

---

```quiz
{
  "prompt": "Why include the UTF-8 declaration when the page already looks correct on your laptop?",
  "multiple": false,
  "options": [
    { "text": "It makes the internet connection faster", "correct": false },
    { "text": "It states the decoding rule instead of relying on a browser guess", "correct": true },
    { "text": "It creates the visible page heading", "correct": false },
    { "text": "It turns the file into an application", "correct": false }
  ],
  "explanation": "A successful guess on one machine is fragile. The declaration tells browsers how bytes become characters."
}
```

---

## Nesting preserves the tree

This closes the outer container too early:

```html
<p>Bring a <strong>broken lamp</p></strong>
```

The inner element must close first:

```html
<p>Bring a <strong>broken lamp</strong>.</p>
```

Think of stacked trays: last placed, first removed. Indentation does not change meaning, but it exposes the tree. When tags become confusing, re-indent before changing them.

---

## Predict the repaired tree before opening DevTools

Browsers try hard to display imperfect HTML. That kindness can hide the source of a bug.

Predict the parent of the second paragraph after the browser repairs this source:

```html
<p>
  Bring one item.
  <p>Volunteers cannot store items overnight.</p>
</p>
```

A paragraph cannot contain another paragraph. When the parser reaches the second `<p>`, it closes the first paragraph implicitly, then starts a sibling paragraph. The live DOM is effectively:

```html
<p>Bring one item.</p>
<p>Volunteers cannot store items overnight.</p>
```

The page may look acceptable, which is why visual inspection alone is weak evidence. In DevTools, expand the parent and compare its children with the tree you intended. Browser repair is useful recovery, not permission to leave malformed source.

---

## Headings are an outline, not a size picker

Choosing `h3` because it looks smaller creates a missing level:

```html
<h1>Repair Cafe Saturday</h1>
<h3>What to bring</h3>
```

Use levels to express nesting:

```html
<h1>Repair Cafe Saturday</h1>
<h2>What to bring</h2>
<p>One portable item per visitor.</p>
<h2>Plan your visit</h2>
<h3>Opening hours</h3>
<p>Saturday, 10:00 to 14:00.</p>
```

Use one `h1` for the page subject, `h2` for major sections, and `h3` for a subsection inside an `h2`. CSS will later change appearance without corrupting this outline.

---

## Heading levels continue only when the content really nests

HTML provides `h1` through `h6`. That does not mean every page should contain all six.

Suppose “Plan your visit” contains “Accessibility,” which itself contains “Step-free entrance”:

```html
<h2>Plan your visit</h2>
<h3>Accessibility</h3>
<h4>Step-free entrance</h4>
```

The `h4` is justified because it names a subsection inside the `h3` topic. If “Step-free entrance” is merely one fact, a paragraph or list item may be more honest.

Do not jump from `h2` to `h5` to obtain a smaller default size. Do not create headings for every sentence. A heading promises that content below belongs to a named section. Use the next level when the information hierarchy deepens, and return to the appropriate earlier level when that subsection ends.

Run the outline test closed notes: read only the headings in order. They should tell a coherent story about the page without depending on font size.

---

## Text meaning is local and precise

```html
<p>Please <strong>switch off and unplug</strong> your item.</p>
<p>Bring <em>one</em> item, not a box of items.</p>
<p>Edit <code>index.html</code>, then press <kbd>Ctrl</kbd> + <kbd>S</kbd>.</p>
```

`strong` means strong importance; `em` marks stress that changes how a sentence is read. `code` marks a code fragment and `kbd` marks user input. `mark` highlights relevant text, while `small` fits side comments such as legal detail.

`br` creates a meaningful line break inside content such as an address. `hr` marks a thematic break. Repeated `br` elements are not a spacing tool.

---

## Line breaks and thematic breaks are content decisions

An address can contain line divisions that belong to the content:

```html
<p>
  Riverside Community Hall<br>
  14 Library Road<br>
  Pune 411001
</p>
```

Here `br` means “continue this same address on the next line.” It does not open and close a new paragraph.

This attempt uses breaks only to push content apart:

```html
<p>Event details</p>
<br><br><br>
<p>Venue details</p>
```

It works visually at one font size, then becomes arbitrary when presentation changes. The blank distance has no meaning. Spacing belongs to CSS, starting on Day 3.

`hr` is also semantic. It marks a change of theme within the content. Browsers usually draw a line for it, but “I want a line” is not enough reason to add one. If the topic has not changed, a decorative divider later belongs in CSS rather than as a false thematic break in HTML.

---

## The same-looking text can carry different meaning

The browser's default styles make `strong` bold and `em` italic in many cases. That appearance is a default, not their definition.

```html
<p><strong>Unplug the appliance before arrival.</strong></p>
<p>You may bring <em>one</em> portable item.</p>
<p>Open <code>index.html</code> and press <kbd>Ctrl</kbd> + <kbd>S</kbd>.</p>
<p><mark>Saturday only</mark></p>
<p><small>Repairs depend on available volunteers and parts.</small></p>
```

`strong` marks serious importance. `em` marks stress: moving it can change the sentence's implied contrast. `code` identifies computer code, while `kbd` identifies input a person types or presses. `mark` highlights something relevant to the current context. `small` marks side information such as caveats or legal text; it does not mean “make any unimportant paragraph tiny.”

Now test the tempting shortcut. Replace every one of those elements with `span`. The visible page can be made to look similar later, but the meanings disappear from the document tree. Choose the element from the meaning, then let CSS handle appearance on Day 3.

---

## Lists reveal relationships

A paragraph of items is hard to scan. If order does not matter, use `ul`; if it does, use `ol`.

```html
<ul>
  <li>Lamp</li>
  <li>Toaster</li>
  <li>Fan</li>
</ul>

<ol>
  <li>Check in.</li>
  <li>Meet a volunteer.</li>
  <li>Inspect the item together.</li>
</ol>
```

Use a description list for name-and-description pairs:

```html
<dl>
  <dt>Diagnosis</dt>
  <dd>A volunteer examines the item with you.</dd>
  <dt>Repair</dt>
  <dd>You decide whether to continue.</dd>
</dl>
```

`dt` names the term and `dd` describes it. This meaning, not a desire for two columns, is the reason to choose `dl`.

---

## Nest a list only when one item owns a sub-list

A navigation menu can contain a smaller list belonging to one item:

```html
<nav aria-label="Primary">
  <ul>
    <li><a href="index.html">Home</a></li>
    <li>
      Visit
      <ul>
        <li><a href="#venue">Venue</a></li>
        <li><a href="#accessibility">Accessibility</a></li>
      </ul>
    </li>
    <li><a href="mailto:hello@example.com">Contact</a></li>
  </ul>
</nav>
```

The inner `ul` sits inside the `li` for Visit because those links are children of that navigation choice. Placing the inner list as a sibling after the closing `li` breaks that ownership relationship even if indentation makes it look related.

Lists add structure; `nav` adds the larger landmark meaning. A list of ingredients is not navigation, and a navigation region need not contain a list in every possible design. Choose each element for its own relationship.

---

```quiz
{
  "prompt": "Which outline represents one page title, two major sections, and a subsection inside the second section?",
  "multiple": false,
  "options": [
    { "text": "`h1`, `h2`, `h2`, then `h3`", "correct": true },
    { "text": "`h1`, `h3`, `h2`, then `h4`", "correct": false },
    { "text": "Four `h1` elements", "correct": false },
    { "text": "Bold paragraphs because levels only control size", "correct": false }
  ],
  "explanation": "Heading numbers express nesting. The subsection is one level below its parent `h2`."
}
```

---

## Plain contact text makes the visitor work

Turn destinations into actions:

```html
<a href="https://example.org/events">All events</a>
<a href="pages/guide.html">Visitor guide</a>
<a href="#venue">Jump to the venue</a>
<a href="mailto:hello@example.com">Email us</a>
<a href="tel:+919876543210">Call us</a>
```

`a` means anchor; `href` names its destination. An in-page link needs a matching unique label:

```html
<section id="venue">
  <h2>Venue</h2>
</section>
```

For an external link deliberately opened in a new tab, pair `target="_blank"` with `rel="noopener noreferrer"`. `noopener` severs the opener relationship; `noreferrer` withholds the referring address. Do not force every link into a new tab.

---

## Five destinations, five different address shapes

The `href` value is a destination. Its shape depends on where the destination lives.

```html
<a href="https://repairs.example.org/events">Another website</a>
<a href="/events/saturday.html">From this site's root</a>
<a href="pages/guide.html">Relative to this file</a>
<a href="#venue">A place inside this page</a>
<a href="mailto:hello@example.com">An email action</a>
```

An absolute web address includes the scheme and host, such as `https://repairs.example.org`. A root-relative path begins with `/` and starts from the current site's root. A relative path starts beside the current HTML file. A fragment begins with `#` and finds a matching `id` in the current document. `mailto:` and `tel:` ask the device to open a suitable application.

The easiest path mistake is assuming that a leading slash means “start beside this file.” It does not. On GitHub Pages, a project may live below a repository path, so a root-relative `/images/hall.jpg` can point somewhere different from `images/hall.jpg`. For this first one-folder site, prefer paths you can trace from the current file.

---

## New tabs are a product decision, not a link upgrade

This is valid when keeping the current page open is genuinely useful:

```html
<a
  href="https://city.example.org/transport"
  target="_blank"
  rel="noopener noreferrer"
>
  Check city transport
</a>
```

`target="_blank"` asks for a new browsing context, commonly a new tab. It changes the visitor's navigation, so do not apply it automatically.

`noopener` prevents the opened page from receiving a live connection back to the opener. `noreferrer` prevents the destination from receiving the source page's address as referral information and also provides opener protection in older behavior. The privacy tradeoff is real: analytics on the destination lose the referral.

The rule is not “all external links need new tabs.” Ordinary links should usually behave ordinarily. Use a new tab when losing the current work would be harmful, then include the safety relationship.

---

## Relative paths are walking directions

```text
repair-cafe/
├── index.html
├── pages/
│   └── guide.html
└── images/
    └── hall.jpg
```

From `index.html`, the image is `images/hall.jpg`. From `pages/guide.html`, it is `../images/hall.jpg`; `..` means go up one folder.

When a resource breaks, do not try random prefixes. Name the current file, draw the tree, and walk to the target. Match capitalization exactly because deployed servers may distinguish `Hall.jpg` from `hall.jpg`.

---

```quiz
{
  "prompt": "From `pages/guide.html`, which path reaches `images/hall.jpg` at the project root?",
  "multiple": false,
  "options": [
    { "text": "`pages/images/hall.jpg`", "correct": false },
    { "text": "`images/hall.jpg`", "correct": false },
    { "text": "`../images/hall.jpg`", "correct": true },
    { "text": "`../pages/hall.jpg`", "correct": false }
  ],
  "explanation": "Start beside the current file, go up from `pages`, then down into `images`."
}
```

---

## An image needs a visual source and a text replacement

```html
<img
  src="images/hall.jpg"
  alt="Brick entrance of the Community Hall beside the library"
  width="1200"
  height="800"
>
```

`src` locates the file. `alt` replaces the information when the picture is not seen. `alt="image"` and a filename add no useful meaning. For a purely decorative image, use `alt=""`; omitting the attribute may make assistive software announce the filename.

Dimensions tell the browser the proportions before the bytes arrive, reducing a jump when the image loads. `loading="lazy"` can delay an off-screen image, but usually should not delay the main image already visible at the top. `decoding="async"` is a hint that decoding need not block other visual work.

---

## Write alternative text from the image's job

The same photograph can need different alternative text in different contexts.

On the noticeboard, the entrance photo helps a visitor recognize the venue:

```html
<img
  src="images/hall.jpg"
  alt="Brick Community Hall entrance beside the library, with blue double doors"
  width="1200"
  height="800"
>
```

In a gallery whose caption already says those exact words, repeating them in `alt` would make a screen reader announce the same information twice. In that context, the image might use shorter text or, if it adds nothing beyond the caption, `alt=""`.

Ask in order:

```text
Does the image communicate information or enable an action?
  yes → write the useful replacement for this context
  no  → alt="" so assistive software can skip it
```

Do not begin with “what objects are visible?” Begin with “what would be lost if the image failed to load?” That question produces useful text instead of a visual inventory.

---

## Dimensions prevent a page jump before the image arrives

Temporarily throttle the network in DevTools and reload a page containing an image with no `width` or `height`. The browser initially does not know how much vertical space the file will need. Text below it can appear higher, then jump downward when the image dimensions arrive.

With intrinsic dimensions present, the browser knows the proportion is `1200:800`, or `3:2`, before the image bytes finish downloading. It can reserve the right shape early. The attributes describe the file's intrinsic dimensions; they do not mean the page must display the image at 1200 CSS pixels on every screen.

Use `loading="lazy"` for images below the first screen when delaying them saves work. Do not automatically lazy-load the page's main visible image: the browser may wait to fetch the very image the visitor is looking at.

---

## One image can offer several formats

```html
<picture>
  <source srcset="images/hall.avif" type="image/avif">
  <source srcset="images/hall.webp" type="image/webp">
  <img
    src="images/hall.jpg"
    alt="Brick entrance of the Community Hall beside the library"
    width="1200"
    height="800"
  >
</picture>
```

Each `source` offers a candidate. `type` lets the browser reject an unsupported format without downloading it. The final `img` supplies the fallback, alternative text, and dimensions. `picture` describes one image, not three visible images.

Predict the browser's choice before testing:

```text
browser supports AVIF     → choose hall.avif and stop
otherwise supports WebP   → choose hall.webp and stop
otherwise                 → use the img fallback hall.jpg
```

Source order matters because the first suitable candidate wins. Keep the same subject and crop across the format alternatives; `picture` here is choosing an encoding, not showing three different pieces of content.

---

```quiz
{
  "prompt": "Which statements about an informative image are correct?",
  "multiple": true,
  "options": [
    { "text": "Its `alt` explains what the image contributes in context", "correct": true },
    { "text": "Its filename is usually ideal alternative text", "correct": false },
    { "text": "Its dimensions help reserve space before loading", "correct": true },
    { "text": "The main image at the top must always be lazy-loaded", "correct": false }
  ],
  "explanation": "Contextual alternative text replaces meaning, and dimensions reduce movement. Filenames are rarely useful descriptions, and delaying the first visible image can hurt."
}
```

---

## Correct tags still need large-region labels

A page built only from headings and paragraphs displays, but its navigation, central content, and closing information are anonymous.

```html
<body>
  <header>...</header>
  <nav aria-label="Primary">...</nav>
  <main>...</main>
  <footer>...</footer>
</body>
```

`header` introduces a page or section. `nav` wraps a major navigation set. `main` holds the page's central content. `article` is self-contained enough to share separately. `section` groups a themed part and normally has a heading. `aside` is related but secondary. `footer` closes a page or section.

If none fits, `div` is a neutral container. The useful rule is not “never use `div`.” It is “do not discard a meaning you already know.”

---

## `article`, `section`, and `aside` answer different tests

These three are easy to use as interchangeable named boxes. They are not.

An `article` should make sense as a self-contained item if it were shared or reused elsewhere. A complete event notice, news story, or forum post can pass that test.

A `section` groups a themed part of the current page. It normally needs a heading because the heading tells readers what theme binds its contents.

An `aside` contains related but secondary material. Remove it and the central subject still makes sense. A volunteer recruitment note beside the event details may be an aside; the date and venue are not secondary, so they should not be moved there.

Try the removal test:

```text
Can this piece stand alone?                → consider article
Does it group one named part of this page? → consider section
Is it related but non-central?             → consider aside
None of those meanings fit?                → div may be honest
```

These are judgment tests, not rigid laws. If two choices are defensible, write down the reason that matches the content instead of choosing the tag with the most impressive name.

---

## Landmarks make a long page navigable without changing its pixels

Imagine a keyboard or screen-reader user arriving on a page containing thirty links before the event details. If every region is a `div`, the user may have to move through those links one by one.

Landmarks expose large regions in the accessibility tree:

```html
<header>
  <h1>Riverside Repair Cafe</h1>
</header>

<nav aria-label="Primary">
  <a href="#event">Event</a>
  <a href="#venue">Venue</a>
</nav>

<main>
  <article id="event">...</article>
</main>

<footer>...</footer>
```

`main` identifies the central content of this document. `nav` is for a major set of navigation links, not every cluster of links. `aria-label="Primary"` distinguishes this navigation from another one such as footer navigation.

The visible page may barely change when `div` becomes `nav` or `main`. That is the point: HTML communicates relationships beyond appearance.

---

## Three small semantic tools

Keep a caption attached to its media:

```html
<figure>
  <img src="images/table.jpg" alt="Visitors repairing appliances together" width="1200" height="800">
  <figcaption>Last month's repair table.</figcaption>
</figure>
```

Use native disclosure for an optional answer:

```html
<details>
  <summary>Can I bring a microwave?</summary>
  <p>No. Bring an item one person can carry safely.</p>
</details>
```

Give software a standard date while keeping human text natural:

```html
<time datetime="2026-09-26T10:00">Saturday at 10:00</time>
```

`figure` groups media with a caption that belongs to it. The caption may appear before or after the media, but it stays inside the figure.

`details` owns the hidden or revealed content, and its first `summary` provides the visible control. This is native browser behavior, so it works without JavaScript. Use it for optional disclosure, not for information every visitor must notice immediately.

`time` preserves natural human wording while giving software a standardized value in `datetime`. The text may say “Saturday at 10:00”; the attribute carries the exact date and time. If the time matters across locations, include an offset or make the location rule explicit instead of pretending a local time is universal.

---

## Inspect the browser's tree

Open Chrome DevTools with `Option + Command + I` on macOS or `Ctrl + Shift + I` on Windows and Linux. In Elements, use the picker and click the heading.

Edit its text in DevTools, then refresh. The change disappears because you edited the live tree, not `index.html`.

View Page Source shows delivered HTML. Elements shows the live tree the browser is using. They are nearly identical today, but later code can change the live tree.

For broken nesting: pick the surprising element, inspect its parent and siblings, return to the source, and fix the earliest malformed container.

Use this exact debugging loop rather than editing at random:

```text
1. Observe the wrong thing on the page.
2. Use the element picker to select it.
3. Read its parent and sibling relationships in Elements.
4. Find the first relationship that differs from your intended tree.
5. Repair that earliest source mistake.
6. Refresh and verify that the live tree now matches.
```

Editing text in Elements is useful for testing a wording change, but refresh restores the file's version. When a DevTools change works, repeat it in `index.html`; otherwise you proved an idea without saving the result.

---

## A local address is not a public address

An address beginning with `file://` points to your computer. Sending it to a friend does not send the file.

Publishing copies the project to a computer reachable on the internet. Git first records a local snapshot:

```bash
git init
git status
git add index.html images
git commit -m "Build semantic repair cafe noticeboard"
```

`status` reports what Git sees. `add` selects content for the snapshot; it does not upload. `commit` records the selected snapshot locally.

Create an empty public GitHub repository, then use the repository address GitHub supplies:

```bash
git branch -M main
git remote add origin https://github.com/YOUR-NAME/repair-cafe.git
git push -u origin main
```

The remote is the GitHub destination. `push` copies commits there. In repository Settings, enable Pages from `main` and the root folder. Test the resulting address in a private window so a signed-in session or cache cannot hide a problem.

If the first commit stops with “Author identity unknown,” Git is not rejecting the HTML. It does not yet know what name and email to write into the snapshot record. Follow the commands Git prints, using an identity you intend to associate with commits, then run the commit again.

If `git push` asks for authentication, use GitHub's current sign-in flow or credential helper. A GitHub account password is not necessarily accepted as a Git transport password. Read the exact authentication message instead of repeatedly changing the remote URL.

The command prompt returning without a visible web page does not mean Pages is instant. Hosting can take a short time to publish a new commit. Check the repository's Pages or Actions status, then reload the public URL after the deployment completes.

---

## Predict what each Git command can and cannot change

Before running the commands, write the expected location of the latest work after each line:

```text
after saving index.html      file on this computer
after git add               selected snapshot contents, still local
after git commit            recorded snapshot, still local
after git push              commit copied to GitHub
after Pages publishes       files served at a public web address
```

Now compare with `git status` after each step. `status` is a report, not a mutation. `add` chooses content for the next snapshot. `commit` records that selection in local history. `remote add` records where a remote repository lives. `push` transfers commits. Pages is the host that serves one selected branch.

Keeping those stages separate makes failures diagnosable. If GitHub shows the commit but the public page is old, repeating `git add` cannot help because the local snapshot already reached GitHub. Inspect the Pages source and deployment instead.

---

## Deployment failures have observable fingerprints

Use the symptom to choose the next check:

| Symptom | Likely boundary | Next check |
|---|---|---|
| `git status` shows the file as untracked | selection | run `git add` for the intended file |
| GitHub lacks the latest commit | transfer | inspect the remote and the result of `git push` |
| Public address returns 404 | hosting path or Pages source | confirm Pages uses `main` and the intended folder |
| Page loads but an image is broken | resource path or filename case | open the image URL and compare exact case |
| Signed-in browser works but private window fails | cached or private access | verify repository visibility and public URL |

GitHub Pages needs an entry document at the published location. A file named `Index.html`, a file nested one folder deeper than expected, or Pages pointed at the wrong branch can all make a correct document unreachable.

Do not diagnose deployment by changing HTML semantics. First locate the broken stage: local file, snapshot, transfer, or host.

---

```quiz
{
  "prompt": "Which description of publishing is accurate?",
  "multiple": false,
  "options": [
    { "text": "`git add` uploads the page to every browser", "correct": false },
    { "text": "A `file://` address becomes public when copied", "correct": false },
    { "text": "Pages edits the HTML before Git records it", "correct": false },
    { "text": "Git records locally, push copies commits, and Pages serves the selected branch", "correct": true }
  ],
  "explanation": "Snapshot, transfer, and hosting are separate stages, which is why each can be diagnosed separately."
}
```

---

## Hands-on build: Community Noticeboard v0

Build one semantic repair-cafe page using only HTML. Include a header, in-page navigation, one main region, a self-contained event notice, bring and arrival lists, a figure with useful `alt` and dimensions, a machine-readable time, one disclosure answer, contact actions, and a footer.

Decision point: is the volunteer note central event content or secondary related content? Choose `section` or `aside` from that answer and record your reason.

Commit, push, enable Pages, and share the public address with one person. Done means they can learn when and where the event happens and contact the organiser without copying an address.

---

## Changed task: a lost-pet notice

Sketch the tree before typing. Decide what deserves the single `h1`, whether the notice can stand as an `article`, which facts form a list, how the sighting date uses `time`, what the photo must communicate without sight, and which contact detail becomes an action.

Build only `main`. This tests selection by meaning rather than copying the repair-cafe order.

---

## Common mistakes

| Mistake | Why it hurts | Better move |
|---|---|---|
| Choosing headings by size | The outline stops matching the content | Choose levels from section nesting |
| Crossing closing tags | The browser must repair an ambiguous tree | Close the inner element first |
| Writing `alt="image"` | The replacement communicates nothing | Describe the image's contextual contribution |
| Guessing paths | Deployment exposes wrong routes and case | Walk from the current file through the tree |
| Using `div` for every region | Useful roles disappear | Choose a semantic element when its meaning fits |
| Treating `git add` as upload | Local history and hosting get confused | Status, add, commit, push, then verify Pages |

---

## Practice

Type and run all five. Make the prediction or plan before opening the relevant screen again.

### Tier 1: retrieve the model

1. **Reconstruct.** Closed notes, write the minimum document from `doctype` through closing `html`. Beside each line, state the one failure or ambiguity it prevents. Open the lecture only after the attempt and correct in a different color.

### Tier 2: trace the browser

2. **Repair a tree.** Predict the DOM produced by `<p>Bring <strong>one item</p></strong>`, inspect the browser's repaired tree, then fix the source. Explain why “it looks fine” was not enough evidence.

3. **Walk a path.** From `pages/info.html`, predict the path to `images/map.png`, deliberately try the wrong `images/map.png`, then open the image address directly and use the folder tree to prove why `../images/map.png` works.

### Tier 3: make content decisions

4. **Replace an image.** Write alternative text for a venue photo used first as directions and then as decoration. The two answers must differ because the image's job differs.

5. **Transfer.** Convert a club announcement into a heading outline, landmarks, a machine-readable time, a list, and a contact action. Then change the task into a single lost-pet notice and decide again whether the central item is an `article` or `section`. Record the reason, not only the tag.

Review prompts: reconstruct the document after roughly 1, 3, 7, 14, and 30 days after study; on a changed page, justify `article`, `section`, `aside`, or `div`. Record whether each success needed help, was independent once, survived delay, or transferred.

---

## Cheat sheet

```text
DOCUMENT: doctype → html(lang) → head + body
HEAD: charset, viewport, title, description
OUTLINE: h1 page → h2 section → h3 subsection
TEXT: p, strong, em, mark, code, kbd, small
LISTS: ul unordered, ol ordered, dl term-description
LINKS: https:, relative path, #id, mailto:, tel:
IMAGE: src + contextual alt + width + height
LANDMARKS: header nav main article section aside footer
DEBUG PATHS: current file → up/down folders → exact case
PUBLISH: status → add → commit → push → Pages → private-window check
```

---

## Tomorrow

The noticeboard can explain an event, but it cannot collect a loan request or compare borrowing plans. Tomorrow, controls turn visitor choices into named values, while tables and disclosure elements organize information the page must expose honestly.

---

```finalquiz
{
  "title": "Day 1: HTML Foundations",
  "questions": [
    {"id":"q1","type":"single_correct","prompt":"What is HTML's main job today?","codeSnippet":null,"options":[{"id":"a","text":"Encrypt files"},{"id":"b","text":"Describe content meaning and structure"},{"id":"c","text":"Choose final colors"},{"id":"d","text":"Store submissions"}],"correctOptionIds":["b"],"explanation":"HTML labels content and relationships; styling, behavior, and storage are separate responsibilities.","example":"`h1` means main heading, not large text."},
    {"id":"q2","type":"multiple_correct","prompt":"Which belong in `head`?","codeSnippet":null,"options":[{"id":"a","text":"Visible event heading"},{"id":"b","text":"Accepted-items list"},{"id":"c","text":"UTF-8 declaration"},{"id":"d","text":"Browser-tab title"}],"correctOptionIds":["c","d"],"explanation":"Decoding and the tab title describe the page; visitor content belongs in `body`.","example":"Browser information in `head`, page content in `body`."},
    {"id":"q3","type":"single_correct","prompt":"Which fragment is correctly nested?","codeSnippet":null,"options":[{"id":"a","text":"`<p>Bring <strong>one</strong>.</p>`"},{"id":"b","text":"`<p>Bring <strong>one</p></strong>`"},{"id":"c","text":"`<p>Bring <strong>one</p>`"},{"id":"d","text":"`<p></strong>one<strong></p>`"}],"correctOptionIds":["a"],"explanation":"The inner element closes before its outer container.","example":"Last opened, first closed."},
    {"id":"q4","type":"single_correct","prompt":"Which heading fits a subsection inside an `h2` section?","codeSnippet":null,"options":[{"id":"a","text":"Another `h1`"},{"id":"b","text":"A bold paragraph"},{"id":"c","text":"`h3`"},{"id":"d","text":"`h6` because it looks small"}],"correctOptionIds":["c"],"explanation":"Heading levels express nesting, not desired font size.","example":"Page `h1` → section `h2` → subsection `h3`."},
    {"id":"q5","type":"multiple_correct","prompt":"Which link choices are sound?","codeSnippet":null,"options":[{"id":"a","text":"Use `mailto:` for email"},{"id":"b","text":"Use `#venue` with matching `id=\"venue\"`"},{"id":"c","text":"Force every link into a new tab"},{"id":"d","text":"Resolve every path from the project root"}],"correctOptionIds":["a","b"],"explanation":"Schemes and matching fragments create useful actions; relative paths start from the current file.","example":"`#venue` finds the unique element labelled `venue`."},
    {"id":"q6","type":"single_correct","prompt":"Which `alt` best helps someone recognize the venue?","codeSnippet":null,"options":[{"id":"a","text":"`hall.jpg`"},{"id":"b","text":"`Image of venue`"},{"id":"c","text":"Empty text despite useful directions"},{"id":"d","text":"`Brick entrance beside the library with blue doors`"}],"correctOptionIds":["d"],"explanation":"The useful replacement communicates the details the picture contributes.","example":"Describe the image's job, not its filename."},
    {"id":"q7","type":"multiple_correct","prompt":"What does a correct `picture` provide?","codeSnippet":null,"options":[{"id":"a","text":"One logical image represented by several possible files"},{"id":"b","text":"A download of every source"},{"id":"c","text":"Modern candidates through `source`"},{"id":"d","text":"Fallback and `alt` through `img`"}],"correctOptionIds":["a","c","d"],"explanation":"The browser selects one supported candidate for one logical image, while `img` remains the fallback and accessibility owner.","example":"AVIF, WebP, then JPEG fallback."},
    {"id":"q8","type":"single_correct","prompt":"Which element fits a self-contained event notice?","codeSnippet":null,"options":[{"id":"a","text":"`article`"},{"id":"b","text":"`br`"},{"id":"c","text":"`meta`"},{"id":"d","text":"`strong`"}],"correctOptionIds":["a"],"explanation":"An article can make sense as an independently shared piece.","example":"A complete event notice can be an `article`."},
    {"id":"q9","type":"multiple_correct","prompt":"What helps diagnose a deployment-only broken image?","codeSnippet":null,"options":[{"id":"a","text":"Check filename capitalization"},{"id":"b","text":"Walk the path from the current HTML file"},{"id":"c","text":"Assume the server repairs paths"},{"id":"d","text":"Replace landmarks with `div`"}],"correctOptionIds":["a","b"],"explanation":"Case and relative-route mistakes often appear after deployment; semantics do not repair paths.","example":"`Hall.jpg` may differ from `hall.jpg`."},
    {"id":"q10","type":"single_correct","prompt":"Which publishing sequence is accurate?","codeSnippet":null,"options":[{"id":"a","text":"Pages commits before files exist"},{"id":"b","text":"`git add` uploads immediately"},{"id":"c","text":"Commit locally, push, then Pages serves the branch"},{"id":"d","text":"Share the local `file://` address"}],"correctOptionIds":["c"],"explanation":"Recording, transfer, and hosting are separate stages.","example":"status → add → commit → push → Pages."}
  ]
}
```
