# Phase 1: HTML & CSS Foundations (Days 1-14)

**Duration:** 14 days · ~58 hours
**Goal:** Go from a blank file to publishing original, accessible production interfaces with raw CSS and Tailwind. The phase preserves the full CSS foundations sequence and ends with a constraint-led neighborhood resource portal rather than a personal site or branded clone.

> One day = one lesson. Don't skip ahead, don't drag.

---

## Day 1 — HTML foundations
- How a browser renders a page (HTML -> DOM -> pixels)
- Your first `index.html` opened in VS Code + Live Server
- `<!DOCTYPE>`, `<html lang>`, `<head>`, `<body>` and why each exists
- Headings, paragraphs, links, images, lists
- Semantic landmarks: `header`, `nav`, `main`, `article`, `section`, `aside`, `footer`
- Chrome DevTools first look
- **Mini build:** Community Noticeboard v0 shipped to GitHub Pages

## Day 2 — HTML forms, inputs, tables & element flow
- Forms as `name=value` submission: `action`, `method`, `enctype`, `GET` vs `POST`
- Every input type: `text`, `email`, `password`, `search`, `tel`, `url`, `number`, `date`, `time`, `datetime-local`, `range`, `color`, `file`
- Core attributes: `label`, `name`, `id`, `placeholder`, `required`, `disabled`, `readonly`, `autocomplete`, `inputmode`, `pattern`, `min/max`, `minlength/maxlength`
- `checkbox` vs `radio`, plus `fieldset`, `legend`, `select`, `option`, `optgroup`, `textarea`, `button`
- Tables: `caption`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, `scope`
- Native accordion: `details` + `summary`
- Inline vs block vs `inline-block`
- **Mini build:** Application form with file upload, FAQ accordion, and role comparison table

## Day 3 — CSS foundations: selectors, colors, text, units
- What CSS is: selectors choose, declarations describe, browser paints
- Inline, internal, and external CSS, and why external stylesheets are the default
- Selectors: element, class, id, attribute, grouped, descendant, child, sibling
- Pseudo-classes: `:hover`, `:focus`, `:active`, `:first-child`, `:last-child`, `:nth-child`, `:not()`
- Cascade, specificity, inheritance, source order, and why `!important` is a smell
- Color formats: named, hex, `rgb/rgba`, `hsl/hsla`, `oklch`
- Background shorthand, gradients, opacity vs alpha channels
- Text & font properties: family, size, weight, line-height, letter-spacing, alignment, decoration, transform, truncation
- Units: `px`, `em`, `rem`, `%`, `vw`, `vh`, `vmin`, `vmax`, `ch`
- `cursor` property and first taste of CSS variables
- **Mini build:** Transit disruption bulletin with an intentional hierarchy and accessible state colors

## Day 4 — The box model: spacing, borders, shadows
- The box model: content, padding, border, margin
- `box-sizing: border-box` as the global default
- Margin collapse and modern fixes
- Spacing rhythm and a real 4/8/12/16/24/32 scale
- Border shorthand, per-side borders, `border-radius` for pills/cards/circles
- `outline` vs `border` and accessible focus rings
- Sizing: `width`, `height`, `min-/max-width`, `aspect-ratio`, `overflow`
- `box-shadow`, layered shadows, `text-shadow`, `filter: drop-shadow`
- **Mini build:** Reusable card system (flat / elevated / outlined)

## Day 5 — Display, position, pseudo, and backgrounds
- `display`: block, inline, inline-block, none, and a preview of flex/grid
- `visibility: hidden` vs `opacity: 0` vs `display: none`
- `position`: static, relative, absolute, fixed, sticky
- `top`, `right`, `bottom`, `left`, and `inset`
- Six ways to center, including absolute + `transform: translate(-50%, -50%)`
- `z-index` and stacking contexts
- Pseudo-classes and pseudo-elements: `::before`, `::after`, `::placeholder`, `::selection`, `::marker`
- Background images, stacked backgrounds, gradients, `background-clip: text`
- `cursor` variants for real UI affordances
- **Mini build:** Hero section with background image, overlay, centered headline, and CTA

## Day 6 — Overflow, lists, object-fit, filters & float
- `overflow`: visible, hidden, scroll, auto, clip
- `overflow-x` vs `overflow-y`, scroll containers, horizontal strips, scroll-snap basics
- Custom scrollbar basics and sticky-inside-scroll-container gotchas
- List styling: `list-style-type`, `list-style-position`, `list-style-image`
- Removing bullets for navs while preserving semantic lists
- Custom bullets and counters with `::marker`, pseudo-elements, and ordered list styles
- `object-fit`: fill, contain, cover, none, scale-down
- `object-position` for avatars, thumbnails, hero crops, and video covers
- `filter`: blur, brightness, contrast, grayscale, saturate, sepia, drop-shadow
- `backdrop-filter` for frosted overlays and modals
- `float` and `clear`: legacy layouts, text wrap, clearfix, and refactoring to Flexbox/Grid
- **Mini build:** Article/media polish lab with custom lists, clipped media cards, filters, and one float-to-modern-layout refactor

## Day 7 — Flexbox (one-dimensional layout mastery)
- Main axis vs cross axis
- `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-content`, `gap`
- `flex-grow`, `flex-shrink`, `flex-basis`, `flex: 1`, `align-self`, `order`
- Real patterns: navbars, button rows, card rows, media objects, sticky footer
- Accessibility risk of visual reordering with `order`
- **Mini build:** Three-tier pricing section

## Day 8 — CSS Grid (two-dimensional layout mastery)
- Tracks, lines, cells, areas
- `grid-template-columns`, `grid-template-rows`, `repeat()`, `minmax()`, `fr`
- Placement: `grid-column`, `grid-row`, `span`, `place-items`, `place-self`
- `grid-template-areas` for page shells
- `auto-fit` / `auto-fill` in real card grids
- Sidebar/content/aside layouts, galleries, dashboards, and magazine sections
- **Mini build:** Hero + features + testimonials shell

## Day 9 — Media queries (the conditional layer of CSS)
- `@media` as conditional CSS
- Mobile-first `min-width` queries vs desktop-first `max-width` queries
- Breakpoint scale: 640, 768, 1024, 1280, 1536
- Modern range syntax: `@media (width >= 768px)` and band queries
- Orientation queries: portrait / landscape
- Capability queries: `hover`, `pointer`, `any-hover`, `any-pointer`, `resolution`
- Preference queries: `prefers-color-scheme`, `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`
- Container query intro: `container-type`, named containers, and `@container`
- Debugging responsive rules in DevTools
- **Mini build:** Adaptive card + preference-aware theme

## Day 10 — Fluid sizing & responsive patterns
- Responsive design as smooth adaptation, not breakpoint spam
- The four-lever framework: intrinsic layout, fluid sizing, container queries, media queries
- `clamp()` for fluid type and spacing
- `min()` and `max()` for runtime sizing decisions
- `aspect-ratio` for videos, avatars, thumbnails, and media frames
- Intrinsic Grid with `repeat(auto-fit, minmax(...))`
- Flex wrapping with `flex: 1 1 280px`
- Prose width with `ch` units and `clamp()`
- Container queries in depth and container query units: `cqi`, `cqw`, `cqh`, `cqb`
- Responsive images: `srcset`, `sizes`, `<picture>`, width/height attributes, lazy loading, decoding
- **Mini build:** Fully responsive landing slice verified at 320px, 375px, 768px, 1024px, and 1440px

## Day 11 — Transitions, transforms & animations
- `transform`: `translate`, `rotate`, `scale`, `skew`, chained transforms, `transform-origin`
- `transition` shorthand and easing curves
- Animating `transform` and `opacity` before expensive layout properties
- `@keyframes` and the `animation` shorthand
- Looping, alternating, paused animations, fill modes
- Common patterns: fade-in, slide-up, pulse, skeleton shimmer, spinner, bounce animation
- `prefers-reduced-motion` safety
- **Mini build:** Motion polish pack — buttons, cards, hero entrance, loading skeleton

## Day 12 — Tailwind foundations (utility-first mastery)
- Why utility-first won
- Tailwind v4 setup in Vite
- The 90% class set: spacing, sizing, layout, type, color, borders, shadow, effects
- Responsive prefixes, state variants, dark mode
- `group`, `peer`, `aria-*`, and `data-*` variants
- **Mini build:** Rebuild the pricing section in Tailwind

## Day 13 — Tailwind components, theming & practice
- `@theme` tokens for color, spacing, fonts, radii, shadows
- Token discipline over utility soup
- Reusable component recipes: button, input, card, navbar, hero, pricing, FAQ, modal
- Production patterns and class-ordering convention
- Whole-page Tailwind builds: marketing, dashboard, auth, settings
- Deliberate practice pack with timed drills
- **Project:** Component library + marketing slice, themed, dark-mode-ready, responsive

## Day 14 — UI/UX principles + Neighborhood Resource Portal
- Figma basics for developers: inspect spacing, typography, colors, assets, and layout structure
- UI/UX principles: visual hierarchy, spacing rhythm, type pairing, contrast, affordances, scanning patterns
- Cloning strategy: observe -> skeleton -> style -> content -> polish
- Build a service directory and service-detail route from a content inventory
- Build community updates and an organization profile without borrowing a social-product interaction model
- Responsive polish, screen-by-screen comparison, Lighthouse pass
- Validate against wireframe, content, responsive, and accessibility acceptance criteria
- **Capstone:** Neighborhood Resource Portal on GitHub with a live URL and decision log

---

## CSS Coverage Audit

Covered explicitly in Phase 1:

- CSS introduction; inline, internal, and external CSS
- selectors, advanced selectors, pseudo-classes, pseudo-elements
- cascade, specificity, inheritance, source order
- colors, backgrounds, gradients, text, fonts, sizing units, variables
- box model, margin, padding, borders, radius, outlines, shadows
- display, position, z-index, overflow, lists, float, clear
- Flexbox, Grid, media queries, container queries, responsive images
- transforms, transitions, animations, object-fit/object-cover, filters
- Figma basics and evidence-led interface reconstruction

---

## Phase 1 Capstone

**Neighborhood Resource Portal** — an original Tailwind interface where residents browse services, open details, scan local updates, and inspect verified organization profiles. It is themed, responsive, accessible, deployed, and documented with the constraints and simplifications the learner chose.

> _Next phase: JavaScript — make pages react to user input and real data._
