# Day 2: HTML Forms, Inputs, Tables, and Element Flow

**Duration: 4.5 hours | Focus: Collect useful visitor choices with accessible, honest HTML controls**

## Why this day exists

Yesterday's noticeboard speaks, but it cannot listen.

A visitor can read which tools are available, yet must leave the page to request one.

Putting empty rectangles beside labels looks like a form. It is not enough. The browser needs to know what each answer is called, which answers belong together, and when an answer is unacceptable.

Today the noticeboard becomes an equipment-loan request desk.

---

## The form that looks complete but submits nothing useful

Add this to a new `request.html`:

```html
<form>
  Your name <input type="text">
  Tool <input type="text">
  <button>Send request</button>
</form>
```

It works in the shallow sense: you can type and press the button. But the text does not programmatically label the controls, neither answer has a submission name, and the form has no destination.

The browser cannot turn “two anonymous boxes” into a useful request.

---

## The mental model: a form packs labelled pairs

Think of submission as packing an envelope:

```text
visitor types "Asha"
        ↓
control has name="borrower"
        ↓
submitted pair: borrower=Asha
        ↓
action chooses the destination
method chooses how the pairs travel
```

The visible label helps the person. The `name` labels the submitted value for the receiver. They solve different problems, so a robust control usually needs both.

The browser does not submit “the form” as one mysterious object. It walks the form's successful controls and builds pairs:

```text
control is inside the submitted form
        ↓
control is eligible to submit
        ↓
control has a name
        ↓
browser reads its current value
        ↓
name=value pair enters the request
```

“Successful control” is the browser term for a control whose value participates. A named text input usually participates. An unchecked checkbox does not. A disabled control does not. A button participates only in particular submission cases. These differences are deliberate because “the visitor did not choose this” and “the visitor chose the value `false`” are not automatically the same data.

---

## A label is an interaction, not nearby text

This looks labelled to a sighted reader:

```html
Email <input type="email" name="email">
```

But the word and control have no relationship in the document. Click the word `Email`: nothing focuses. A screen reader encountering the input may announce only “edit text” or infer weakly from nearby content.

Connect them explicitly:

```html
<label for="email">Email</label>
<input id="email" name="email" type="email">
```

The `for` value and the `id` value match exactly. Now clicking the label focuses the control, which increases the usable target, and assistive software can announce the control's name.

There is also a wrapping form:

```html
<label>
  Email
  <input name="email" type="email">
</label>
```

Both patterns create a label relationship. The explicit `for` and `id` pattern is easier to use when the label and control are separated by supporting text. IDs must be unique in the document; two controls with `id="email"` make references ambiguous.

---

## Predict the payload before seeing it

What pairs will this form create?

```html
<form action="/requests" method="get">
  <label for="borrower">Your name</label>
  <input id="borrower" name="borrower" value="Asha">

  <label for="tool">Tool</label>
  <input id="tool" value="Drill">

  <button type="submit">Send request</button>
</form>
```

Write the answer as `name=value`. One control is deliberately missing something. Feedback comes next.

---

## `name` is the shipping label

The submission contains `borrower=Asha`. It does not contain `Drill` because that input has no `name`.

`id` identifies an element inside the document. The label's `for="borrower"` points to the input's matching `id="borrower"`; clicking the label then focuses the input.

`name` identifies the value in submission. Matching `id` and `name` is convenient but not required; their jobs differ.

`value` is the current value. A visitor can replace it in a text input. `placeholder` is only a hint shown when the field is empty, not a persistent label.

> No `name` means no submitted pair, even if the visitor can see and edit the control.

---

## `value` supplies data; `placeholder` supplies a temporary hint

These two inputs look similar before typing:

```html
<input name="city" value="Pune">
<input name="cityHint" placeholder="Example: Pune">
```

The first control already contains the value `Pune`. If submitted unchanged, it produces `city=Pune`. The visitor can edit or replace it.

The second control is empty. Its faint placeholder appears only while no value is present. If submitted untouched, it does not produce `cityHint=Pune`; the example was never data.

Now use a placeholder as the only prompt:

```html
<input name="memberCode" placeholder="Six-digit member code">
```

The attempt seems compact. Type the first digit and the prompt disappears. A visitor checking the required format must now remember it, and the control still lacks a programmatic label.

The repair separates three jobs:

```html
<label for="member-code">Member code</label>
<input
  id="member-code"
  name="memberCode"
  placeholder="Example: 042731"
  aria-describedby="member-code-hint"
>
<p id="member-code-hint">Enter all six digits, including a leading zero.</p>
```

The label names the control, the placeholder gives a short example, and the persistent hint explains the rule. `aria-describedby` connects the control to that explanatory paragraph for assistive technology. It supplements the label; it does not replace it.

---

## Predict four controls, then inspect the address

Do not run this yet. Write the exact pairs you expect after the visitor checks the case, leaves the bits unchecked, and submits:

```html
<form action="/requests" method="get">
  <input name="borrower" value="Asha">
  <input id="tool" value="Drill">
  <input type="checkbox" name="accessory" value="case" checked>
  <input type="checkbox" name="accessory" value="bits">
  <input name="branch" value="North" disabled>
  <button type="submit">Send</button>
</form>
```

Write the pairs in order. Include an explicit reason beside every control you omit. Feedback follows on the next screen.

---

## Payload feedback: visible does not mean successful

Now run it. The meaningful part of the address is:

```text
?borrower=Asha&accessory=case
```

Trace each omission instead of calling it random:

```text
borrower    named + enabled                         → included
tool        visible, but no name                    → omitted
case        named + checked                         → included
bits        named + unchecked                       → omitted
branch      named, but disabled                     → omitted
```

That trace is the foundation for debugging every larger form today.

---

```quiz
{
  "prompt": "A visitor types `Drill` into a visible input, but the submitted request omits it. What is the most direct cause?",
  "multiple": false,
  "options": [
    { "text": "The input has an `id`", "correct": false },
    { "text": "The form uses a button", "correct": false },
    { "text": "The input has no `name`", "correct": true },
    { "text": "The label is visible", "correct": false }
  ],
  "explanation": "Submission is built from successful named controls. `id` supports document relationships, while `name` labels the submitted value."
}
```

---

## GET and POST solve different transport needs

With `method="get"`, the browser places pairs in the address:

```text
/requests?borrower=Asha&tool=Drill
```

That is useful for searches and filters because the result can be bookmarked and shared. It is poor for passwords and large or sensitive submissions because the values become part of the address and browser history.

With `method="post"`, the browser sends pairs in the request body instead of the address. POST does not automatically make data secret. The site still needs HTTPS, and the receiving server must protect stored information.

`action` names the destination. An empty action submits to the current address. While learning without a server, you can use GET and inspect the resulting address to verify the pairs.

---

## Method chooses the journey, not the meaning of the fields

The same `name=value` pairs can travel with GET or POST. Changing the method does not make `name` optional and does not change a checkbox into a radio button.

With GET, the query string becomes part of the URL. The browser encodes characters that cannot safely appear there. A search for `cordless drill` may appear as:

```text
/requests?query=cordless+drill
```

That visibility is useful for a catalog search: copy the URL and another person can open the same query. It is harmful for a password or identity number because addresses are copied, logged, stored in history, and sometimes sent as referrer information.

POST moves the form payload into the request body. It is the normal choice for creating or changing data, for larger payloads, and for files. It does not encrypt the request. HTTPS protects data in transit; server authorization, validation, and storage rules protect it after arrival.

Use this decision:

```text
Is the request retrieving a shareable view with no sensitive values? → consider GET
Is it creating/changing data or carrying a file?                     → use POST
```

Those are strong defaults, not claims that the browser alone enforces good server design.

---

## Text-like input types give the browser useful intent

Start with the smallest loan identity group:

```html
<label for="email">Email</label>
<input
  id="email"
  name="email"
  type="email"
  autocomplete="email"
  required
>
```

`type="email"` gives the browser an email-shaped validation rule and may offer a suitable mobile keyboard. It does not prove the address exists.

Related types express intent:

- `text`: general short text
- `password`: hides the displayed characters, not the network value
- `search`: search text, sometimes with a clear affordance
- `tel`: telephone input without universal format validation
- `url`: an address-shaped value

`autocomplete` describes the real-world value so the browser can fill it accurately. Common values include `name`, `email`, `tel`, `street-address`, and `postal-code`.

---

## Input types are browser contracts, not decoration

Start with three fields that all accept one line of text:

```html
<label for="account-email">Email</label>
<input id="account-email" name="email" type="email" autocomplete="email">

<label for="account-password">Password</label>
<input id="account-password" name="password" type="password" autocomplete="current-password">

<label for="catalog-search">Search tools</label>
<input id="catalog-search" name="query" type="search">
```

They can look similar on a laptop, but the type tells the browser what the value *means*. `email` can apply email-shaped validation and offer an email keyboard. `password` masks the visible characters and lets password managers recognize the field. Masking is shoulder-surfing protection, not encryption. `search` identifies a search query and may receive platform-specific controls such as a clear button.

`tel` requests telephone-friendly input but does not impose one worldwide phone format because valid formats differ by country. `url` expects an address-shaped value, commonly including a scheme such as `https://`. `text` is the honest fallback for short text without a more specific contract.

The trap is choosing a type from appearance. Choose it from the data's meaning and the browser behavior you want.

---

## `autocomplete` must describe this field precisely

This attribute is not a general on/off switch. Its token describes which saved value belongs here:

```html
<input name="fullName" autocomplete="name">
<input name="email" type="email" autocomplete="email">
<input name="phone" type="tel" autocomplete="tel">
<input name="postalCode" inputmode="numeric" autocomplete="postal-code">
```

If a form creates a new password, use the `new-password` token; if it asks for the existing account password, use `current-password`. Giving both fields the same vague token encourages the browser to fill the wrong value.

The value is a hint to the browser, not a command. Browsers and password managers may use more context, and the visitor remains in control.

---

## Dates and numbers are not all the same field

```html
<label for="days">Loan length in days</label>
<input id="days" name="days" type="number" min="1" max="14" step="1">

<label for="pickup-date">Pickup date</label>
<input id="pickup-date" name="pickupDate" type="date">

<label for="pickup-time">Pickup time</label>
<input id="pickup-time" name="pickupTime" type="time">

<label for="appointment">Appointment</label>
<input id="appointment" name="appointment" type="datetime-local">
```

`number` is for a quantity a person may calculate with. Do not use it for a postal code or phone number; those may contain leading zeroes or non-numeric separators.

`min`, `max`, and `step` constrain accepted numeric or date values. `datetime-local` captures local date and time but no time zone, so the receiving system needs a separate location or zone rule if that distinction matters.

---

## A number field is for quantity, not digits

Compare two six-character values:

```text
loan length:  7       adding one day makes sense → 8
member code:  042731  adding one makes no useful business sense
```

The first is a quantity, so `type="number"` fits. The second is an identifier made of digits, so text fits. Number controls and receiving systems may normalize formatting; an identifier needs its leading zero and exact character sequence preserved.

```html
<label for="days">Loan length in days</label>
<input id="days" name="days" type="number" min="1" max="14" step="1">

<label for="member-code">Six-digit member code</label>
<input
  id="member-code"
  name="memberCode"
  type="text"
  inputmode="numeric"
  pattern="[0-9]{6}"
>
```

`inputmode="numeric"` changes the keyboard hint without changing the value into a number. `pattern` describes the accepted text shape. Here `[0-9]` means one digit and `{6}` means exactly six repetitions. The pattern is checked against the whole value by form validation.

Do not use an unfamiliar pattern without testing valid and invalid examples. A pattern that rejects a legitimate code is not “stricter”; it is wrong.

---

## Date controls collect components, not scheduling truth

Each time-related type has a narrower job:

```html
<input type="date" name="pickupDate">
<input type="time" name="pickupTime">
<input type="datetime-local" name="appointment">
```

`date` collects a calendar date. `time` collects a clock time. `datetime-local` combines them but still does not say *where on Earth* that clock reading applies.

For an equipment desk serving one physical branch, the branch location can supply the missing time-zone rule. For a remote meeting across countries, “2026-10-04 at 10:00” is incomplete until the product defines a zone or offset.

Browsers may render these controls differently, and unsupported or constrained environments can fall back toward text entry. The server must still parse and validate what arrives.

---

## Range, color, and file controls have specialized outputs

```html
<label for="confidence">Repair confidence</label>
<input id="confidence" name="confidence" type="range" min="0" max="10" value="5">

<label for="label-color">Label color</label>
<input id="label-color" name="labelColor" type="color" value="#336699">

<label for="proof">Proof of address</label>
<input id="proof" name="proof" type="file" accept="image/*,.pdf">
```

A range gives quick approximate selection, but its current number may not be visible without later scripting; use it only when precision is not the main task. A color input submits a color value. A file input gives the form a selected file, not a normal text path.

---

## Specialized controls reveal their own limits

A range control is quick when “roughly how much?” is the real question. It is a poor choice for an exact loan duration if the person cannot see the selected value. Pair the task with a visible scale or choose `number` when precision matters.

A color control commonly produces a color value such as `#336699`. That does not make the chosen colors readable together; contrast is a separate design decision.

A file input gives the browser permission to let the person select local files. The page does not receive an unrestricted path into the person's computer. Modern browsers deliberately avoid exposing useful local filesystem paths because that would reveal private machine details.

`accept="image/*,.pdf"` narrows the picker toward images and PDF files. It is guidance. A renamed or crafted file can still arrive, so the receiver must inspect what it actually got.

`accept` guides the file picker but is not a security check. A server must still inspect uploaded content.

---

## Hints, limits, and states are different promises

```html
<label for="member-code">Member code</label>
<input
  id="member-code"
  name="memberCode"
  type="text"
  inputmode="numeric"
  minlength="6"
  maxlength="6"
  pattern="[0-9]{6}"
  placeholder="Example: 042731"
  required
>
```

`inputmode="numeric"` hints at a numeric keyboard without turning the identifier into a number. `minlength` and `maxlength` constrain character count. `pattern` supplies a full regular-pattern rule; here it requires exactly six digits. The placeholder shows a format example but disappears during typing, so the real label remains.

`required` rejects an empty successful control. It does not mean “this value is true” for every control, nor does it replace server validation.

---

## Constraint attributes answer different failure questions

Do not treat the validation attributes as interchangeable ways to make a field “strict.”

```text
required       is a value required at all?
minlength      does this text have enough characters?
maxlength      is this text too long?
min / max      is this quantity or date inside the allowed range?
step           does the value move in allowed increments?
pattern        does this text match the required shape?
type="email"   does this resemble the browser's email grammar?
```

Trace a loan-length value of `2.5` through this control:

```html
<input type="number" name="days" min="1" max="14" step="1" required>
```

It is present, above the minimum, and below the maximum. It still fails because `2.5` is not a whole step from the control's step base. A value can satisfy one constraint and fail another.

Native validation is feedback, not an explanation of business policy. Put human guidance near the control when the reason matters, such as “Loans last from 1 to 14 whole days.”

---

```quiz
{
  "prompt": "Which choices fit a six-digit member code that may begin with zero?",
  "multiple": true,
  "options": [
    { "text": "Use `type=\"number\"` because it contains digits", "correct": false },
    { "text": "Use a text input so leading zeroes remain text", "correct": true },
    { "text": "Use `inputmode=\"numeric\"` as a keyboard hint", "correct": true },
    { "text": "Use a label only as placeholder text", "correct": false }
  ],
  "explanation": "An identifier is not a quantity. Text preserves its exact characters, while `inputmode` can still request a convenient keyboard."
}
```

---

## `disabled` and `readonly` do not mean the same thing

```html
<label for="request-id">Request ID</label>
<input id="request-id" name="requestId" value="REQ-1042" readonly>

<label for="branch">Closed branch</label>
<input id="branch" name="branch" value="North" disabled>
```

A readonly text-like control can be focused and is submitted, but the visitor cannot edit it. A disabled control cannot be interacted with and is omitted from submission.

That omission surprises beginners. If the receiver needs the value, disabling its only named control silently removes data. Prefer readonly when the value should travel but must not be edited, where the control type supports it.

The visual appearance is not the contract. A disabled field may look grey, but CSS could change that later. Diagnose from behavior and payload:

```text
readonly   focusable in common text controls, value cannot be edited, value submits
disabled   unavailable for interaction, value does not submit
```

If a branch is fixed but must reach the server, readonly may fit a text input. If the branch is genuinely unavailable and should not participate, disabled fits. Do not use either merely to make a field “look locked.”

---

## Checkboxes answer independent yes-or-no questions

```html
<fieldset>
  <legend>Accessories needed</legend>
  <label>
    <input type="checkbox" name="accessory" value="case">
    Carrying case
  </label>
  <label>
    <input type="checkbox" name="accessory" value="bits">
    Drill-bit set
  </label>
</fieldset>
```

The visitor may choose neither, either, or both. Checked controls submit their value. An unchecked checkbox normally submits no pair.

The shared `name` groups repeated answers for the receiver; distinct `value` strings identify which choices were checked. `fieldset` draws a programmatic boundary, and `legend` names the group.

---

## Predict checkbox payloads, including the empty case

With both boxes checked, the browser can submit the same name twice:

```text
accessory=case&accessory=bits
```

That is not a collision. Repeated names represent a collection of selected values. The receiver decides how to collect them.

With neither checked, there is normally no `accessory` pair at all. The browser does not invent `accessory=false`. If the server needs an explicit false-like value, that is a data-design decision the form and server must make together.

Adding `required` to one checkbox requires that specific checkbox, which is useful for “I accept the terms.” It does not generally mean “choose at least one from this arbitrary set.” Do not copy a radio-group rule onto checkboxes and assume the same behavior.

---

## Radio buttons choose one answer from a group

```html
<fieldset>
  <legend>Loan plan</legend>
  <label><input type="radio" name="plan" value="standard" required> Standard</label>
  <label><input type="radio" name="plan" value="supported"> Supported</label>
  <label><input type="radio" name="plan" value="extended"> Extended</label>
</fieldset>
```

The common `name="plan"` creates the one-choice group. If each radio has a different name, the browser treats them as unrelated and allows several to be checked.

Place `required` on one member of the named group to require a selection. The `legend` asks the shared question; individual labels name the answers.

Trace the one-choice mechanism:

```text
click Standard  → plan=standard is checked
click Extended  → plan=standard becomes unchecked
                  plan=extended becomes checked
submit          → exactly one plan pair travels
```

The exclusivity comes from the shared `name`, not from proximity, matching IDs, or the `fieldset`. The fieldset supplies group meaning; the shared name supplies radio behavior and the submitted key.

---

## Select and textarea cover two different shapes

```html
<label for="tool">Tool</label>
<select id="tool" name="tool" required>
  <option value="">Choose a tool</option>
  <optgroup label="Electrical">
    <option value="drill">Cordless drill</option>
    <option value="meter">Multimeter</option>
  </optgroup>
  <optgroup label="Garden">
    <option value="shears">Hedge shears</option>
  </optgroup>
</select>

<label for="purpose">What will you repair?</label>
<textarea id="purpose" name="purpose" rows="5" maxlength="500"></textarea>
```

`select` chooses from a controlled set. Each option's `value` is the submitted value; its text is the human label. The empty first value makes `required` useful instead of silently accepting a real default.

`optgroup` labels related choices but is not itself selectable. `textarea` accepts multi-line text; its starting content goes between its tags, not in a `value` attribute.

---

## A select needs an honest starting state

This version silently chooses the first real plan before the visitor decides:

```html
<select name="plan" required>
  <option value="standard">Standard</option>
  <option value="extended">Extended</option>
</select>
```

If Standard is a genuine safe default, that may be correct. If the visitor must make an informed choice, the page is pretending a decision happened.

Use an empty prompt option:

```html
<select id="plan" name="plan" required>
  <option value="">Choose a plan</option>
  <option value="standard">Standard</option>
  <option value="extended">Extended</option>
</select>
```

The visible option text is for the person. The `value` is for submission. Keep stable machine values such as `extended` even if the visible wording later changes to “Extended, up to 14 days.”

`textarea` follows a different syntax because it is not an `input` element:

```html
<textarea name="purpose" rows="5">Existing starting text</textarea>
```

Whitespace between the tags can become part of the starting value. An indented blank line is not always visually harmless, so inspect what the control actually contains.

---

## Button types prevent an expensive accidental submission

Inside a form, a bare `<button>` defaults to submission in HTML. This innocent-looking helper can send an unfinished form:

```html
<button>Add another reference</button>
```

State the intent:

```html
<button type="button">Add another reference</button>
<button type="reset">Clear form</button>
<button type="submit">Send request</button>
```

`button` performs no built-in form action. `reset` restores initial values and can erase work, so use it sparingly. `submit` asks the browser to validate and submit the form.

The failure is easiest to feel in a long form. Fill every field, then press a reset button you mistook for “clear the current search.” The browser restores all initial values at once, and there is no built-in undo. A technically valid button type can still be a poor product decision.

---

```quiz
{
  "prompt": "Three loan plans should allow exactly one selection. What creates that behavior?",
  "multiple": false,
  "options": [
    { "text": "Three checkboxes with different names", "correct": false },
    { "text": "Three radio buttons sharing one `name`", "correct": true },
    { "text": "Three text inputs sharing one `id`", "correct": false },
    { "text": "Three submit buttons with different labels", "correct": false }
  ],
  "explanation": "Radio buttons are mutually exclusive within a shared named group. IDs must remain unique and do not create radio grouping."
}
```

---

## File upload changes how the envelope is packed

Text pairs fit ordinary form encoding. Actual file bytes require multipart encoding:

```html
<form action="/requests" method="post" enctype="multipart/form-data">
  <label for="proof">Proof of address</label>
  <input
    id="proof"
    name="proof"
    type="file"
    accept="image/*,.pdf"
    multiple
    required
  >
  <button type="submit">Send request</button>
</form>
```

`enctype="multipart/form-data"` separates the submitted parts so binary file content can travel. Use it with POST for file uploads. `multiple` allows more than one file.

The browser's `accept` filter and native validation improve the interaction but do not protect the server. Files can be renamed or crafted; receiving code must check size, actual type, and safety.

---

## Predict the broken upload before submitting it

Suppose the form keeps `method="get"` and omits `enctype`. The file picker still opens, and the filename may even appear in the control. That visible success is misleading: a GET query cannot carry the file bytes as a multipart upload.

The working contract needs all of these pieces:

```text
input type=file        lets the visitor choose file data
name                   gives that submitted part a key
method=post            carries a request body
multipart/form-data    separates text fields and binary file parts
server validation      decides whether received bytes are acceptable
```

If an upload fails, verify the chain in that order. Changing `accept` cannot repair a missing `name`, and adding `required` cannot repair the wrong form encoding.

---

## Native validation is the first gate, not the final authority

```html
<input type="number" name="days" min="1" max="14" step="1" required>
<input type="text" name="code" minlength="6" maxlength="6" pattern="[0-9]{6}" required>
```

The browser can block ordinary submission and explain a mismatch. This gives fast feedback without JavaScript.

But a visitor or another program can send a request without using your page. Therefore the server must repeat every rule that protects correctness or security.

Use native constraints when they match the real policy. A name field with `pattern="[A-Za-z]+"` would reject valid names containing spaces, accents, or punctuation. A stricter rule is not automatically a better rule.

---

## Native validation fails before submission, then the server starts over

Run this sequence with the six-digit member code:

```text
value "42731"      five characters   → browser blocks ordinary submit
value "04A731"     six characters    → length passes, pattern fails
value "042731"     six digits        → browser allows submit
```

The browser reports the first relevant constraint it finds. That is quick local feedback. It is not proof that the eventual request obeys the policy, because requests can be created without this page and browser checks can be bypassed.

The honest architecture is two gates:

```text
browser validation  → helps this visitor correct ordinary mistakes quickly
server validation   → protects shared data from every request source
```

When the browser blocks a form, focus the reported control, inspect its current value, then compare it with the type and each constraint. Do not remove `required` or `pattern` merely to make the message disappear; first decide whether the policy or the value is wrong.

---

## A table is for intersecting facts, not visual alignment

Loan plans have values that intersect by row and column, so a table fits:

```html
<table>
  <caption>Borrowing plan comparison</caption>
  <thead>
    <tr>
      <th scope="col">Plan</th>
      <th scope="col">Maximum days</th>
      <th scope="col">Deposit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Standard</th>
      <td>3</td>
      <td>₹500</td>
    </tr>
    <tr>
      <th scope="row">Extended</th>
      <td>14</td>
      <td>₹1,500</td>
    </tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3">Deposits are returned after inspection.</td></tr>
  </tfoot>
</table>
```

`caption` names the table. `thead`, `tbody`, and `tfoot` group its regions. `tr` is a row, `th` is a header cell, and `td` is a data cell. `scope` states whether a header labels its column or row. `colspan="3"` makes the footer cell span three columns.

Do not use a table merely to place a label beside an input. That content is not tabular data.

---

## Predict a cell's headers before trusting the table

Take the deposit value `₹1,500`. A reader needs two labels to understand it:

```text
column header: Deposit
row header:    Extended
```

That intersection is why a table fits. `scope="col"` says a header applies down its column. `scope="row"` says it applies across its row. The caption names the data set as a whole.

Now remove the `scope` attributes and stare at the pixels. The table can look identical, which makes the omission easy to miss. Visual alignment is not the same as an explicit relationship. For a simple table, scoped headers make those relationships clear to assistive technology and to future maintainers.

Use `tfoot` for rows that summarize or qualify the table. It does not mean “make this text visually sit at the bottom.” `colspan="3"` changes the cell's relationship to three columns, so the number must match the intended grid.

Debug a table by counting cells row by row:

```text
header row: 3 columns
data row:   3 columns
footer row: 1 cell spanning 3 columns
```

An accidental span of two produces a structural mismatch even if the browser draws something plausible.

---

## Native disclosure keeps optional help compact

```html
<details>
  <summary>Which proof documents are accepted?</summary>
  <p>A current utility bill or tenancy agreement is accepted.</p>
</details>
```

`summary` is the visible control. The remaining content is revealed or hidden by the browser. Add the `open` attribute when the answer should begin expanded.

This is a disclosure, not a replacement for a radio group or checkbox. Opening an explanation does not submit a choice.

`summary` must be the first summary child that names the disclosure. The `open` Boolean attribute means the details begin revealed:

```html
<details open>
  <summary>Current safety notice</summary>
  <p>Battery tools must arrive without a charger connected.</p>
</details>
```

Boolean attributes work by presence. `open="false"` still contains the `open` attribute and therefore still opens the disclosure. Remove the attribute to begin closed.

---

## Why some elements stack and others sit in a sentence

Yesterday, paragraphs and sections began new lines while anchors sat inside text. That is the browser's default flow.

```text
block-like box: occupies its own line in normal flow
inline box: participates inside a line of text
inline-block: sits in the line but can keep explicit box dimensions
```

The browser's defaults make `div`, `p`, and headings block-like, while `a`, `strong`, and `span` are inline. HTML meaning and visual display are separate: tomorrow CSS can change `display` without changing an anchor's meaning.

Inline content wraps with text, so applying a width to an ordinary inline element does not behave like width on a block. `inline-block` is the bridge when an item must stay in text flow but behave like a sized box.

Do not select HTML elements solely from these defaults. Choose meaning first; CSS will own layout.

---

## Flow is the browser's starting arrangement, not the element's meaning

Put these three links after a paragraph:

```html
<p>Choose a borrowing plan:</p>
<a href="#standard">Standard</a>
<a href="#supported">Supported</a>
<a href="#extended">Extended</a>
```

The paragraph begins on a new line and the links share a line while space permits. That is normal flow using the browser's default display behavior.

Now imagine choosing `div` instead of `a` because you want each choice on a new line. You would gain the initial stacking but lose the link behavior and meaning. Day 3 can change presentation while keeping anchors as anchors.

An inline box participates in a line of text, so line breaking can split its content across lines. A block-like box begins in the block flow and ordinarily takes its own line. An inline-block box participates beside text while keeping one rectangular box for sizing. This is a display model, not a replacement for semantics.

Before CSS, the transferable rule is:

> Choose HTML from meaning. Observe the default flow, but do not corrupt meaning to obtain a temporary arrangement.

---

## Diagnose a form from the submitted result backward

Suppose the address after a GET submit is:

```text
/requests?borrower=Asha&plan=standard
```

The tool, unchecked accessory, and disabled branch are missing. Diagnose each differently:

1. Missing visible text input: inspect whether it has a `name`.
2. Missing checkbox: confirm whether it was checked; unchecked normally means absent.
3. Missing disabled control: remember disabled controls are omitted.
4. Wrong radio result: inspect whether the group shares one `name` and each option has the intended `value`.
5. Submission blocked: read the browser's validation message, then compare the value with `required`, length, range, step, type, and pattern rules.

This procedure follows observable output instead of changing attributes at random.

---

```quiz
{
  "prompt": "Which facts about native form validation are correct?",
  "multiple": true,
  "options": [
    { "text": "It can give immediate browser feedback before ordinary submission", "correct": true },
    { "text": "It makes server-side validation unnecessary", "correct": false },
    { "text": "Its constraints should match the real policy rather than reject valid people", "correct": true },
    { "text": "The `accept` attribute proves an uploaded file is safe", "correct": false }
  ],
  "explanation": "Browser checks improve the interaction, but requests and files must be checked again by the receiver. Constraints should encode genuine rules, not convenient guesses."
}
```

---

## Hands-on build: Equipment-loan request desk

Build one page containing:

1. A POST form with labelled name, email, telephone, member code, tool, loan length, pickup date, plan, accessories, purpose, and proof controls
2. `fieldset` and `legend` for grouped choices
3. Appropriate autocomplete, keyboard hints, and honest constraints
4. A multiple file input with accepted-type guidance and multipart encoding
5. Explicit button types
6. A plan comparison table with caption and scoped headers
7. A native FAQ using `details` and `summary`

Decision point: decide which questions are independent checkboxes and which form a one-answer radio group. Write the possible answer combinations before choosing.

Because there is no server yet, make a second temporary GET copy without the file field. Submit it and inspect the address to verify names and values. Do not put real sensitive data in that test.

---

## Changed task: a workshop registration form

Create a field plan before writing HTML. The workshop has one session choice, any number of accessibility requests, an optional short note, an email receipt, and a code that may begin with zero.

Choose types and grouping from the data shape. Explain why the session is not a checkbox set and why the code is not a number input. This transfer task should use no new elements.

---

## Common mistakes

| Mistake | Why it hurts | Better move |
|---|---|---|
| Using placeholder as the only label | The prompt disappears and the relationship is missing | Keep a real `label` tied by `for` and `id` |
| Omitting `name` | The visible value is not submitted | Name every value the receiver needs |
| Using `number` for identifiers | Leading zeroes and exact text can be damaged | Use text plus an input-mode hint |
| Giving each radio a different name | Several one-choice answers can be selected | Share one name across the group |
| Leaving helper button type implicit | A helper may submit unfinished work | Declare `type="button"` or `submit` intentionally |
| Disabling a value that must submit | Disabled controls are omitted | Use readonly where supported or redesign |
| Trusting browser validation for security | Requests can bypass the page | Repeat correctness and safety checks on the server |
| Using a table for page layout | Relationships become misleading | Reserve tables for row-column data |

---

## Practice

Type and run all five. Keep DevTools open and write the expected payload before every submission.

### Tier 1: retrieve the pair model

1. **Name the jobs.** Closed notes, explain label text, `for`, `id`, `name`, and `value` without using any of those words in their own definition. Build one field and prove the label relationship by clicking it.

### Tier 2: predict and diagnose

2. **Trace a payload.** Use one text input, one checked checkbox, one unchecked checkbox, one selected radio, one unnamed input, and one disabled input. Predict every pair, submit with GET, and account for every included and omitted control.

3. **Repair a group.** Start with three radio buttons using three names. Demonstrate that all three can be selected, then repair the shared name and verify that only one value submits.

### Tier 3: structure real data

4. **Build associations.** Create a two-row plan table with a caption, column headers, and row headers. Pick one data cell and say both headers that identify it. Add a footer spanning the exact grid width.

5. **Transfer.** Design a library reservation with one branch, several notification channels, a pickup date, an optional note, and a membership code beginning with zero. Then change the requirement so exactly one notification channel is allowed. Revise the controls and explain what changed in the data shape.

Review later: reconstruct the submission-pair model and diagnose a missing field from the resulting address. Mark help, one independent success, delayed recall, and changed-task transfer separately.

---

## Cheat sheet

```text
FORM: action = destination, method = transport, enctype = packing
CONTROL: label ↔ id for people/document; name=value for submission
GET: pairs in address, useful for shareable searches
POST: pairs in body, still needs HTTPS and server checks
TEXT INTENT: email, password, search, tel, url
QUANTITY/TIME: number, date, time, datetime-local
GROUPS: checkbox = independent; radio + shared name = one choice
CHOICES: select > option; optgroup labels subsets
LONG TEXT: textarea content lives between tags
FILES: POST + multipart/form-data; accept is guidance, not proof
STATE: readonly submits; disabled does not
VALIDATION: required, min/max, step, lengths, pattern
TABLE: caption, thead/tbody/tfoot, tr, th(scope), td
FLOW: block starts a line; inline lives in text; inline-block does both
```

---

## Tomorrow

The request desk now has meaning and browser behavior, but it still looks like an unedited document. Tomorrow the browser will evaluate styling rules, resolve conflicts between them, and paint a readable bulletin without changing the HTML's meaning.

---

```finalquiz
{
  "title": "Day 2: Forms, Tables, and Flow",
  "questions": [
    {"id":"q1","type":"single_correct","prompt":"Which attribute labels a control's submitted value?","codeSnippet":null,"options":[{"id":"a","text":"`id`"},{"id":"b","text":"`placeholder`"},{"id":"c","text":"`name`"},{"id":"d","text":"`for`"}],"correctOptionIds":["c"],"explanation":"Submission is assembled from named controls; `id` supports document relationships.","example":"`name=\"tool\"` produces the key `tool`."},
    {"id":"q2","type":"multiple_correct","prompt":"Which are good GET uses?","codeSnippet":null,"options":[{"id":"a","text":"A shareable catalog search"},{"id":"b","text":"A bookmarkable filter"},{"id":"c","text":"A password submission"},{"id":"d","text":"A private identity document upload"}],"correctOptionIds":["a","b"],"explanation":"GET exposes pairs in the address, which helps shareable retrieval but is unsuitable for secrets and files.","example":"`?q=drill&available=yes` can represent a shareable search."},
    {"id":"q3","type":"single_correct","prompt":"Which field best stores a six-digit code that may start with zero?","codeSnippet":null,"options":[{"id":"a","text":"Text with numeric input mode and a six-digit pattern"},{"id":"b","text":"Number with a high maximum"},{"id":"c","text":"Range from zero to six"},{"id":"d","text":"Color input"}],"correctOptionIds":["a"],"explanation":"The code is an identifier, not a quantity. Text preserves every digit while input mode improves the keyboard.","example":"`042731` must remain six characters."},
    {"id":"q4","type":"single_correct","prompt":"Why did a disabled branch field disappear from submission?","codeSnippet":null,"options":[{"id":"a","text":"Its value was too short"},{"id":"b","text":"Disabled controls are omitted from successful submission"},{"id":"c","text":"Every form must use GET"},{"id":"d","text":"Labels remove field values"}],"correctOptionIds":["b"],"explanation":"Disabled means unavailable for interaction and omitted from the submitted controls.","example":"Readonly text can submit; disabled input does not."},
    {"id":"q5","type":"multiple_correct","prompt":"Which correctly describe grouped choices?","codeSnippet":null,"options":[{"id":"a","text":"Checkboxes fit independent yes-or-no choices"},{"id":"b","text":"Radio buttons need unique names to become exclusive"},{"id":"c","text":"A shared radio name creates one group"},{"id":"d","text":"`legend` names the grouped question"}],"correctOptionIds":["a","c","d"],"explanation":"Checkboxes are independent. Radios become mutually exclusive by sharing a name, while the legend labels the group.","example":"Accessories can be checkboxes; one loan plan is a radio group."},
    {"id":"q6","type":"single_correct","prompt":"What should a helper button inside a form declare?","codeSnippet":null,"options":[{"id":"a","text":"`type=\"button\"`"},{"id":"b","text":"`type=\"password\"`"},{"id":"c","text":"`method=\"button\"`"},{"id":"d","text":"No type, because bare buttons never submit"}],"correctOptionIds":["a"],"explanation":"A bare button can default to submit. Declaring `button` prevents accidental form submission.","example":"An “Add reference” helper is not the final submit action."},
    {"id":"q7","type":"multiple_correct","prompt":"What is required for a real file-upload form?","codeSnippet":null,"options":[{"id":"a","text":"POST transport"},{"id":"b","text":"`multipart/form-data` encoding"},{"id":"c","text":"Trusting `accept` as a security check"},{"id":"d","text":"Server-side inspection of received files"}],"correctOptionIds":["a","b","d"],"explanation":"Files need multipart POST packing and receiver-side validation. `accept` only guides the picker.","example":"A renamed file can bypass a filename-based assumption."},
    {"id":"q8","type":"single_correct","prompt":"Which table cell should label the Standard plan row?","codeSnippet":null,"options":[{"id":"a","text":"`td` with no relationship"},{"id":"b","text":"`caption` inside the row"},{"id":"c","text":"`th scope=\"col\"`"},{"id":"d","text":"`th scope=\"row\"`"}],"correctOptionIds":["d"],"explanation":"The plan name is the header for values across its row, so a row-scoped header expresses the relationship.","example":"Standard labels its duration and deposit cells."},
    {"id":"q9","type":"multiple_correct","prompt":"Which native constraints may block ordinary invalid submission?","codeSnippet":null,"options":[{"id":"a","text":"`required`"},{"id":"b","text":"`min` and `max`"},{"id":"c","text":"`pattern`"},{"id":"d","text":"`aria-label` by itself"}],"correctOptionIds":["a","b","c"],"explanation":"Required, range, and pattern constraints participate in native validation. An accessible name does not define value validity.","example":"A required six-digit code can combine `required` and `pattern`."},
    {"id":"q10","type":"single_correct","prompt":"Which description of element flow is accurate?","codeSnippet":null,"options":[{"id":"a","text":"Inline elements always begin a new line"},{"id":"b","text":"Block-like boxes participate only inside a text line"},{"id":"c","text":"Inline-block sits in a line while accepting box dimensions"},{"id":"d","text":"HTML meaning must be chosen from visual display"}],"correctOptionIds":["c"],"explanation":"Inline-block combines inline participation with box-like sizing. Meaning should still determine the HTML element.","example":"Choose an anchor for a link, then let CSS control its display."}
  ]
}
```
