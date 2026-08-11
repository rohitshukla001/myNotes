# Claymorphic UI Redesign — Reusable Design Prompt

A single prompt you paste into Claude (Design, Artifacts, or Claude Code) to redesign any page of
this site from scratch against one shared design system.

**How to use it**

1. Copy everything between the `PROMPT START` and `PROMPT END` markers.
2. Replace the `«…»` placeholders in the **Context** block. Appendix A has a filled-in version for
   this repo — use it as-is for the notes site, or as a worked example for a different surface.
3. Run it once for the design system plus the first page. For every page after that, reuse the same
   prompt with a new Context block and add: *"Reuse the existing tokens and components in
   `assets/css/tokens.css` and `assets/css/library.css` without redefining them. Add a new
   component only if no existing one fits, and say why."*

---

# PROMPT START

## Your role

You are the sole product designer and frontend engineer for this surface. You own information
architecture, interaction design, visual design, and the shipped code. You are not decorating an
existing page — you are designing the thing that should have been built, then building it.

Work in the order below. Do not start writing CSS until the structure and the flows are settled.

## Context

Fill this in before running. Everything else in this prompt is fixed.

```
Product:              «what this site is, in one sentence»
Audience:             «who uses it and what they already know»
Primary job to done:  «the one task that must be fast; everything else is secondary»
Secondary jobs:       «2–4 supporting tasks»
Page/feature:         «the specific surface to design in this run»
Content inventory:    «real counts and shapes of the content — not lorem ipsum»
Current state:        «what exists today, and which files are live vs dead»
Known problems:       «observed IA, UX, and accessibility failures»
Tech constraints:     «build system, hosting, browser support, dependency budget»
Out of scope:         «what not to touch this run»
```

## Hard constraints

These are not negotiable. Violating any one of them means the work is rejected.

- **No Vendasta anything.** No Vendasta branding, colour, typography, iconography, copy voice, UI
  pattern, or component. No Galaxy design system, no Galaxy UI, no Vendasta internal tooling,
  libraries, or design references. This is an independent design system with original styling and
  interactions. Do not look at Vendasta products for inspiration, and do not name them in output.
- **Redesign from first principles.** Do not port the current markup, class names, layout, or
  component boundaries. Read the existing implementation once to inventory *content and behaviour*,
  then close it and design fresh. If you end up reproducing an existing structure, justify it as a
  deliberate choice, not as a default.
- **Flows before pixels.** No visual styling until the information architecture and the task flows
  are written down and defended.
- **Accessibility is a gate, not a pass.** WCAG 2.2 AA across contrast, keyboard operation, focus
  visibility, target size, motion, and semantics. A beautiful page that fails keyboard navigation is
  a failed deliverable.
- **Production-ready, not conceptual.** Real content, real link targets, real empty/loading/error
  states, no placeholder boxes, no "TODO: wire up". If something can't be built, say so instead of
  faking it.

## Working method

Produce the output for each phase before moving to the next. Keep each phase short and concrete.

### Phase 1 — Inventory and interrogate

- List the real content: types, counts, natural groupings, what metadata exists and what is missing.
- List every task a user comes here to do, ranked. Note how many clicks and how much scanning each
  one costs today.
- State the IA problems you found, plainly. Name the ones caused by the current structure rather
  than the current styling.
- Propose a revised information architecture. Say what you are merging, splitting, renaming,
  promoting, demoting, and deleting — and why. Deleting is allowed and encouraged.

**Output:** a content inventory, a ranked task list, and a before/after IA outline.

### Phase 2 — Flows and structure

- For the primary job, design the shortest path that stays legible. Specify entry point, steps,
  feedback at each step, and the recovery path when it goes wrong.
- Decide what belongs on this page, what belongs one level down, and what should be reachable from
  everywhere (search, navigation, recently used).
- Define the page skeleton as a region outline: skip link, header, navigation, main, complementary,
  footer. Assign one clear purpose per region.
- Define the visual hierarchy as a ranked list — what the eye must hit first, second, third. Anything
  not on that list must not compete.

**Output:** flow descriptions in prose or ASCII, plus a region and hierarchy outline.

### Phase 3 — Design tokens

Implement the token set in **Design system specification** below, exactly. Do not invent a parallel
scale. Extend a scale only by appending a documented step, never by using an off-scale one-off value.

**Output:** one CSS file of custom properties, light and dark, with a comment per group.

### Phase 4 — Components

Build each component from the inventory as a self-contained unit that follows the **Component
contract**. Build the component before the page that uses it. No component may hardcode a colour,
radius, shadow, duration, or spacing value.

**Output:** component CSS plus a markup pattern for each, and a states matrix showing rest, hover,
active, focus-visible, disabled, loading, selected, and error where each applies.

### Phase 5 — Assemble the page

Compose the page from the components with real content. No new one-off styles at this layer beyond
layout composition.

**Output:** the page markup and any page-level script.

### Phase 6 — Verify

Run the **Definition of done** checklist item by item and report the result of each, honestly. If a
check fails and you cannot fix it, say which one and why.

**Output:** the completed checklist with a pass/fail per line.

## Design system specification

### Colour

Warm-neutral clay base, low-saturation accent, one supporting hue for informational contrast. Calm,
not candy. Two themes, both first-class — dark mode is not an inversion filter.

```css
:root {
  /* Surfaces — each step lifts toward the light source (top-left) */
  --bg:            #ECEEF3;  /* page — always the darkest light-theme surface */
  --surface:       #F4F6FA;  /* cards, panels */
  --surface-raised:#FAFBFD;  /* menus, popovers, hovered cards */
  --surface-sunken: #E3E6ED; /* wells, inputs, track backgrounds */

  /* Ink */
  --ink:           #1B1F2A;  /* headings, primary text */
  --ink-muted:     #565E70;  /* body, secondary text — 5.9:1 on --surface */
  --ink-subtle:    #8A93A6;  /* decorative/disabled only — fails body-text contrast */
  --ink-on-accent: #FFFFFF;

  /* Accent — indigo-violet */
  --accent:        #5B54B8;  /* 5.6:1 on --surface; 6.1:1 behind white text */
  --accent-hover:  #4E47A6;
  --accent-soft:   #E7E5F7;  /* tinted fills, selected rows */

  /* Support + status */
  --info:          #2C6E8F;
  --success:       #2F6B4F;
  --warning:       #8A5A12;
  --danger:        #A3342F;

  /* Lines */
  --line:          rgba(27, 31, 42, 0.08);
  --line-strong:   rgba(27, 31, 42, 0.16);

  /* Clay light/shadow — the two ends of the same light source */
  --clay-light:    rgba(255, 255, 255, 0.85);
  --clay-shadow:   rgba(24, 28, 40, 0.16);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg:            #14161C;
    --surface:       #1C1F27;
    --surface-raised:#232733;
    --surface-sunken:#101217;

    --ink:           #EDEFF5;
    --ink-muted:     #A6AEC0;
    --ink-subtle:    #7C8498;
    --ink-on-accent: #14161C;

    --accent:        #A99CFF;  /* 7.0:1 on --surface */
    --accent-hover:  #BDB2FF;
    --accent-soft:   rgba(169, 156, 255, 0.14);

    --info:          #7FC4E8;
    --success:       #7FD1A8;
    --warning:       #E3B872;
    --danger:        #F09A94;

    --line:          rgba(255, 255, 255, 0.08);
    --line-strong:   rgba(255, 255, 255, 0.18);

    --clay-light:    rgba(255, 255, 255, 0.06);
    --clay-shadow:   rgba(0, 0, 0, 0.55);
  }
}
```

Verify every text/background pair you ship and print the ratio in a comment: 4.5:1 for body text,
3:1 for text at 24px+ or 19px bold, 3:1 for the boundary of any control that carries meaning. Never
use `--ink-subtle` for anything a user must read to act — it is below the body-text threshold by
design and exists for disabled and decorative cases only.

Also honour a manual override — `:root[data-theme="dark"]` and `:root[data-theme="light"]` must beat
the media query in both directions, so a toggle can work.

### Typography

One typeface for the whole system, with the system stack as fallback. No display face, no second
family for headings. A monospace stack only where characters must align.

```css
--font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--font-mono: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace;

--text-xs:   0.75rem;   --lh-xs:   1.5;    /* 12 — metadata, never body */
--text-sm:   0.875rem;  --lh-sm:   1.55;   /* 14 — labels, captions */
--text-base: 1rem;      --lh-base: 1.6;    /* 16 — body floor, never smaller */
--text-lg:   1.125rem;  --lh-lg:   1.55;   /* 18 — lead, card titles */
--text-xl:   1.375rem;  --lh-xl:   1.4;    /* 22 */
--text-2xl:  1.75rem;   --lh-2xl:  1.3;    /* 28 */
--text-3xl:  2.25rem;   --lh-3xl:  1.2;    /* 36 */
--text-4xl:  3rem;      --lh-4xl:  1.1;    /* 48 — one per page at most */

--weight-normal: 400;  --weight-medium: 500;
--weight-semi:   600;  --weight-bold:   700;

--tracking-tight: -0.015em;  /* 28px and above only */
--tracking-wide:   0.06em;   /* small caps labels only */
```

Rules: body copy 16px minimum. Measure 60–75 characters for prose, 45–65 in a narrow column. Headings
go semibold, not bold, and take negative tracking only above 28px. Heading levels never skip. Numbers
in tables and lists use tabular figures.

### Space and size

4px base. Use the ramp; do not interpolate.

```css
--space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;  --space-4: 1rem;
--space-5: 1.5rem;   --space-6: 2rem;     --space-7: 3rem;     --space-8: 4rem;
--space-9: 6rem;

--radius-sm:   0.625rem;  /* 10 — chips, badges, inputs */
--radius-md:   0.875rem;  /* 14 — buttons, list rows */
--radius-lg:   1.25rem;   /* 20 — cards, panels */
--radius-xl:   1.75rem;   /* 28 — hero, modal, section wells */
--radius-full: 999px;

--control-sm: 2.25rem;  /* 36 */
--control-md: 2.75rem;  /* 44 — default; meets the 44px target minimum */
--control-lg: 3.25rem;  /* 52 */

--container:  75rem;  /* 1200 content max */
--container-narrow: 44rem;  /* 704 reading max */
```

Clay needs breathing room. Section rhythm on desktop is `--space-7` between blocks and `--space-8`
before a new section; card interiors get `--space-5`. Whitespace is part of the material, not
leftover.

### Elevation — the clay recipes

Clay is one soft body catching light from the top-left. Every surface uses the same light direction.
Three levels of lift and one inset. Nothing else.

```css
--clay-1: 0 6px 14px -4px var(--clay-shadow),
          inset 0 2px 3px var(--clay-light),
          inset 0 -3px 6px rgba(24, 28, 40, 0.06);

--clay-2: 0 14px 30px -10px var(--clay-shadow),
          inset 0 2px 4px var(--clay-light),
          inset 0 -4px 8px rgba(24, 28, 40, 0.07);

--clay-3: 0 26px 56px -18px var(--clay-shadow),
          inset 0 3px 5px var(--clay-light),
          inset 0 -5px 10px rgba(24, 28, 40, 0.08);

--clay-inset: inset 0 3px 8px rgba(24, 28, 40, 0.12),
              inset 0 -2px 3px var(--clay-light);
```

In dark theme the inner dark values go to `rgba(0,0,0,0.45)` and the drop shadows keep the same
geometry with the darker `--clay-shadow`.

Assignment: `--clay-1` for resting cards and buttons. `--clay-2` for hover and for anything sitting
above the page (dropdown, popover, sticky header once scrolled). `--clay-3` for modals and the
command palette only. `--clay-inset` for inputs, wells, pressed buttons, and selected segments.

What separates good clay from bad:

- **Do** keep the shadow soft, wide, and low-contrast, with a negative spread so it hugs the shape.
- **Do** pair every drop shadow with a top inner highlight. That highlight is what makes it clay
  rather than a floating card.
- **Do** let surfaces sit *in* the page. One or two elements lift; the rest are flush or inset.
- **Don't** use `backdrop-filter: blur()` as a texture. At most one blurred layer per page, only for
  a scrim behind a modal, at 8–12px.
- **Don't** stack elevation. A `--clay-2` card does not contain `--clay-2` children.
- **Don't** let contrast collapse. Soft surfaces still need 4.5:1 text and a visible boundary on
  every interactive control.
- **Don't** go pastel-on-pastel. The accent appears on a small share of the page; the rest is neutral.
- **Don't** round everything to `--radius-full`. Pills are for chips and avatars, not for cards.
- **Don't** apply clay to plain text, table rows at rest, or icons.

### Motion

```css
--dur-fast: 120ms;   /* colour, opacity, icon swap */
--dur-base: 180ms;   /* transform, shadow, small layout */
--dur-slow: 260ms;   /* panel, sheet, disclosure */
--ease-out:   cubic-bezier(0.32, 0.72, 0, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: cubic-bezier(0.34, 1.4, 0.64, 1);  /* press release only */
```

Motion has to explain something: where a panel came from, that a press registered, that a filter
changed the list. Animate `transform`, `opacity`, and `box-shadow`. Never animate layout properties
in a loop. Hover lifts 1–2px, press sinks 1px and drops to `--clay-inset`. Entrances travel 8–16px,
no further. Stagger a list by 20–30ms per item for the first eight items, then stop.

Wrap all of it:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Breakpoints

Desktop-first design decisions, mobile-correct execution. Design at 1440, verify at 1280, 1024, 768,
414, and 320.

```css
--bp-sm: 480px;  --bp-md: 768px;  --bp-lg: 1024px;  --bp-xl: 1280px;
```

Prefer intrinsic layout over breakpoints: `grid-template-columns: repeat(auto-fill, minmax(…, 1fr))`,
`clamp()` for fluid type and gutters, container queries where a component must adapt to its slot
rather than the viewport. Reach for a media query only when the layout has to change shape.

At 768 and below: single column, sticky header collapses to a compact bar, secondary navigation moves
into a sheet, tap targets stay at least 44×44 with 8px between them, nothing relies on hover, and
horizontal scroll never appears on the page body — wide children scroll inside their own
`overflow-x: auto` container.

### z-index

```css
--z-base: 0;  --z-sticky: 10;  --z-dropdown: 20;
--z-overlay: 30;  --z-modal: 40;  --z-toast: 50;
```

## Component contract

Every component satisfies all of this or it is not done:

1. **Token-only styling.** No literal colour, radius, shadow, spacing, or duration values.
2. **Composable, not configurable.** Variants come from a single modifier class or `data-` attribute.
   No boolean props that change layout in three places.
3. **Semantic HTML first.** `<button>` for actions, `<a>` for navigation, `<details>` for disclosure,
   `<dialog>` for modals, real form controls with real `<label>`s. Reach for ARIA only when no
   element carries the meaning, and then implement the full keyboard pattern.
4. **Every state defined.** Rest, hover, active, focus-visible, disabled, loading, selected, error —
   whichever apply. Never remove an outline without replacing it.
5. **Content-agnostic.** Survives a one-word label and a forty-word label, a missing image, a missing
   date, zero items, and one thousand items.
6. **Responsive on its own.** Works from a 280px slot to a 1200px slot without a page-level override.
7. **Documented in one line.** What it is for, and when to use a different one instead.

### Inventory

Build what the page needs, skip the rest, and keep names generic so the next page reuses them.

- **Shell** — skip link, header, primary navigation, main, footer, theme toggle
- **Search** — input with inset clay, live results, keyboard-driven command palette (`/` and `⌘K`)
- **Filters** — chip group, single and multi select, clear-all, result count
- **Card** — title, optional media, metadata row, action area; a link-card variant whose whole body
  is one target
- **List row** — denser alternative to the card, for long homogeneous sets
- **Disclosure** — `<details>`/`<summary>` based, animated, `aria-expanded` handled by the element
- **Tabs / segmented control** — inset track, clay thumb, arrow-key navigation
- **Buttons** — primary, secondary, quiet, danger; icon-only with an accessible name; three sizes
- **Form controls** — text input, textarea, select, checkbox, radio, switch, plus label, hint, and
  error message wired with `aria-describedby`
- **Overlays** — modal dialog, bottom sheet on small screens, dropdown menu, tooltip
- **Feedback** — toast, inline alert, skeleton loader, progress
- **States** — empty, loading, error, no-results, each with a heading, a sentence, and one action
- **Navigation aids** — breadcrumb, pagination or load-more, back-to-top
- **Small stuff** — badge, tag, avatar, keyboard-shortcut hint, divider

## Accessibility requirements

- Contrast: 4.5:1 body text, 3:1 large text, 3:1 for control boundaries and meaningful icons. State
  the computed ratio for every pair you introduce.
- Keyboard: every interactive element reachable and operable, in a logical order, with no trap.
  Escape closes overlays and returns focus to the trigger. Arrow keys work inside composite widgets.
  Enter and Space both activate buttons.
- Focus: one visible style used everywhere — a 2px `--accent` ring with a 2px offset, plus a
  contrasting outer edge so it survives on both light and dark surfaces. Use `:focus-visible`, and
  never `outline: none` without a replacement.
- Targets: 44×44 minimum for anything a finger touches, 24×24 absolute floor with spacing.
- Semantics: one `<h1>` per page, no skipped heading levels, landmark regions, `alt` text that
  carries the meaning (empty `alt` for decoration), `lang` set, page `<title>` unique and
  descriptive.
- Forms: visible labels, not placeholders-as-labels. Errors announced, described, and adjacent to the
  field. Never colour alone to signal state.
- Links: no bare "click here". `target="_blank"` always pairs with `rel="noopener"` and an indication
  that it opens elsewhere.
- Motion: respect `prefers-reduced-motion`. Nothing auto-plays, nothing loops, nothing flashes more
  than three times a second.
- Zoom: usable at 200% and at 400% reflow width (320px equivalent) without loss of content.

## UI copy

Plain, short, specific. Sentence case for everything except proper nouns. Labels name the outcome
("Open PDF", not "Submit"). Empty states say what goes here and how to get it. Errors say what
happened and what to do next, without an error code as the whole message. No exclamation marks, no
"Oops", no "Awesome". Never write "seamless", "leverage", "robust", "elevate", "unlock", or
"delightful" in the interface.

## Code output requirements

- Match the repo's existing constraints from the Context block. If it is a static site with no build
  step, ship plain HTML, CSS, and vanilla ES modules that work when served from a static host.
- Split CSS into `tokens.css`, `library.css`, and one file per page. No utility-class framework, no
  CSS-in-JS, no preprocessor unless the Context block asks for one.
- No CDN dependencies. Self-host anything you truly need, and prefer needing nothing. If the site
  currently loads a UI framework, drop it — this design system replaces it.
- Fonts: `font-display: swap`, subset if self-hosted, and a system fallback that does not shift
  layout badly.
- Icons: inline SVG with `aria-hidden="true"` and a `currentColor` fill. No icon font, no icon
  package.
- Progressive enhancement: content renders and links work with JavaScript disabled. Script adds
  search, filtering, and overlays on top.
- No inline `onclick`. Delegate events from one listener per behaviour.
- Delete what your redesign orphans: dead stylesheets, dead scripts, unused images. List every file
  you removed and why.
- Performance: no layout shift on load, images sized and lazy-loaded below the fold, first paint
  under 1s on a mid-range laptop over broadband.

## Definition of done

Report pass or fail on each line, with a note on any fail.

**Structure**
- [ ] IA is different from and better than what existed, and the reasoning is written down
- [ ] The primary job takes fewer actions and less scanning than before
- [ ] Every page region has one purpose; nothing is decoration-only
- [ ] Visual hierarchy matches the ranked list from Phase 2

**System**
- [ ] Zero literal colour, radius, shadow, spacing, or duration values outside `tokens.css`
- [ ] Light and dark both designed, both meet contrast, and a manual toggle overrides the OS setting
- [ ] Every component has its full state matrix implemented
- [ ] A new page could be built from these components without new CSS beyond layout

**Clay**
- [ ] One consistent light direction across every surface
- [ ] At most three elevation levels in use, unstacked
- [ ] At most one blurred layer on the page
- [ ] Accent covers a small share of the surface area; the page reads neutral and calm

**Accessibility**
- [ ] Keyboard-only pass completed on every interaction, including overlays and search
- [ ] Focus visible on every focusable element, on both themes
- [ ] Contrast ratios stated and passing
- [ ] Semantics: one h1, no skipped levels, landmarks present, labels wired
- [ ] `prefers-reduced-motion` honoured
- [ ] Usable at 200% zoom and at 320px width

**Responsive**
- [ ] Verified at 1440, 1280, 1024, 768, 414, 320
- [ ] No horizontal scroll on the body at any width
- [ ] Touch targets 44px with spacing; nothing hover-only

**Production**
- [ ] Real content and real link targets throughout
- [ ] Empty, loading, error, and no-results states all built
- [ ] No console errors or warnings
- [ ] Orphaned files removed and listed
- [ ] No Vendasta or Galaxy reference of any kind

## Deliver

1. Phase 1–2 findings: content inventory, ranked tasks, before/after IA, flow and hierarchy outline.
2. `assets/css/tokens.css`.
3. `assets/css/library.css` plus the markup pattern and state matrix per component.
4. The page and its script.
5. The completed Definition of done checklist.
6. A short list of what you deliberately left out and when it should be added.

# PROMPT END

---

## Appendix A — Context block for this repo

Paste this in place of the empty Context block to redesign the notes site home page.

> **Historical.** The `Current state` and `Known problems` entries below describe the site *before*
> the home-page redesign, and the files they name (`app.html`, `images/`, `assets/css/style.css`,
> `assets/js/script.js`) have since been deleted. Kept verbatim as a worked example of the detail
> level a Context block needs. For a new run, write fresh entries describing the site as it is now.

```
Product:              A personal reference library — one page that gets Rohit Shukla, and anyone he
                      shares the link with, to the right cheat sheet or notes PDF fast.
                      Static site on GitHub Pages at notes.rohitshukla.net.

Audience:             Working software engineers and interview candidates. Technical, in a hurry,
                      usually arriving with a specific topic in mind rather than browsing.

Primary job to done:  Find and open one specific resource by topic name, in seconds, from any device.

Secondary jobs:       Browse what exists in an unfamiliar area; see what was added recently; view
                      two architecture SVG diagrams; reach the Documents and Download App pages;
                      send feedback.

Content inventory:    ~170 files, all static, no CMS:
                      - cheat-sheet/ — 60 PDFs on Java, Go (25 in a go-cheat-sheet/ subfolder),
                        SQL, distributed systems (gRPC, pub/sub, saga, outbox, rate limiting),
                        infra and ops (Kubernetes, Docker, Terraform, Datadog, Grafana,
                        Prometheus, OpenTelemetry), plus 3 SVG diagrams and 2 markdown files
                      - notes/ — 40 PDFs: core Java, Collections and Stream API in three tiers
                        each, Angular, Postgres, Redis, Temporal, DSA, roadmaps, HR questions
                      - docs/ — 15 PDFs: DSA roadmaps and workplace training material
                      - images/ — 15 category PNGs, currently the only label a card carries
                      - 3 .apk builds served from the Download App page
                      No dates, sizes, descriptions, or tags exist on any resource yet.

Current state:        Bootstrap 5.3 + Poppins + AOS + EmailJS, all from CDN. Three pages:
                      index.html (376 lines), myPersonalDocs.html, app.html.
                      index.html holds 12 hardcoded cards in a 4-up grid. Each card is an image
                      with no text title, plus a "↓ Show Resources" anchor using inline
                      onclick="toggleCard(this)" that reveals a <ul> of up to 25 links.
                      Live CSS is assets/css/style.css (629 lines); live JS is assets/js/script.js.
                      Dead files: assets/style.css and assets/script.js — the latter is the search
                      implementation and it targets #cardContainer, .card-section, and
                      .list-group-item, none of which exist in the current markup.

Known problems:       - Search is wired to markup that no longer exists, so it does nothing
                      - Card titles exist only inside images; screen readers get alt text and
                        nothing else, and a failed image leaves an unlabelled card
                      - A 25-item flat link list inside a disclosure with no grouping, no
                        metadata, and no way to scan
                      - Disclosure is an <a href="#"> with onclick and no aria-expanded, so it is
                        not keyboard-correct and it jumps the URL
                      - No way to see all resources at once, no recently-added, no tags, no
                        cross-category view — Java content is split across three cards
                      - Duplicate files under both spaced and kebab-case names (250+DSA
                        QUESTIONS FOR PLACEMENTS.pdf vs 250-plus-dsa-questions-for-placements.pdf,
                        Security Training.pdf vs security-training.pdf, and others)
                      - Workplace training PDFs sit in the same space as study material
                      - target="_blank" everywhere with no rel="noopener" and no external
                        indication
                      - No dark mode; no focus styles beyond the browser default
                      - README's structure section is stale and omits cheat-sheet/, app/, app.html

Tech constraints:     Static hosting, no build step, no server. Plain HTML/CSS/vanilla JS that runs
                      from GitHub Pages. Current and previous two versions of evergreen browsers.
                      Dependency budget: zero new runtime dependencies. Drop Bootstrap, AOS, and
                      Poppins-from-CDN. EmailJS may stay only if the feedback form survives the IA
                      review; if it does, self-host or lazy-load it and keep the form usable
                      without it.

Out of scope:         The PDF files themselves, the .apk artifacts, and the SVG diagram contents.
                      Renaming files on disk is in scope only for the duplicates listed above, and
                      only if you list every rename.
```

## Appendix B — Running it for later pages

Second and subsequent runs get the same prompt, a new `Page/feature:` line, and this addition:

> The design system already exists in `assets/css/tokens.css` and `assets/css/library.css`. Do
> not redefine tokens and do not restyle existing components. Compose this page from what is there.
> If a component is genuinely missing, add it to `library.css` under the same contract and say
> what it is for and why nothing existing fit. Skip Phase 3 and report Phase 4 as a diff.
