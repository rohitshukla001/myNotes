# Notes

A private reference library of cheat sheets, long-form notes and roadmaps, grouped by
topic and searchable from one page. Built for me and for people I send the link to, so
there is no onboarding and nothing to explain.

Live at [notes.rohitshukla.net](https://notes.rohitshukla.net). Excluded from search
engines by `robots.txt` and a `noindex` meta tag, so the link is the only way in.

## What it does

Type a topic and open the document. Search ranks by relevance across titles and
keywords, opens the topics that contain hits, and puts the strongest match first.
Filter by topic from the rail, expand or collapse everything at once, and share the
result: the query and the topic live in the URL.

Every document sits in the markup, so the library browses and every link works with
JavaScript switched off. JavaScript adds search, filtering and the feedback form on
top of that.

Two themes. The choice persists, and the page follows the operating system until you
override it. Contrast is verified at WCAG 2.2 AA across both.

On phones the topic rail is hidden and the accordion carries the navigation.

## Topics

Java & Spring, Go, System design, Infra & ops, SQL & data, DSA, Web, Interview &
career, AI, Workplace, Personal. The rail shows the live count for each; those
numbers are not repeated here, because a number in a README goes stale the first time
a document is added.

## Structure

```
notes/
├── index.html                 The library. Every document is in this markup.
├── myPersonalDocs.html        Workplace documents, reachable by URL only
├── DESIGN-PROMPT.md           Reusable design prompt for future pages
├── robots.txt                 Disallow: /
├── site.webmanifest           Icons and colours for an installed shortcut
├── favicon.ico, *.png         Icon set, at the root where browsers look for it
├── CNAME                      Custom domain for GitHub Pages
│
├── assets/
│   ├── css/
│   │   ├── tokens.css         Design tokens, both themes, base styles
│   │   └── library.css        Components
│   ├── js/
│   │   └── library.js         Search, filtering, accordion, theme, feedback
│   └── fonts/                 Calibri, self-hosted as woff2
│
├── notes/                     Every document, plus the architecture diagrams
│   └── go-cheat-sheet/        Go, one topic per file
│
├── docs/                      Roadmaps and workplace training
│
└── .github/workflows/         static.yml, deploys the repo as-is to Pages
```

## Adding a document

Add one `<li>` to `index.html` inside the right topic, following the rows already
there:

```html
<li data-keys="lowercase title, aliases, filename, topic id, kind">
  <a class="row" href="/notes/your-file.pdf" target="_blank" rel="noopener" data-row>
    <span class="row-title">Your title</span>
    <span class="row-kind">Cheat sheet</span>
  </a>
</li>
```

`data-keys` is the search haystack. Anything a reader might type belongs in it,
including the filename. Keep both halves in sync: a word that appears in the title but
not in `data-keys` makes the row unfindable.

`row-kind` is one of Cheat sheet, Notes, Roadmap or Link.

Then bump that topic's two count numbers, one in the rail and one on the section
heading. Those are the fallback for readers without JavaScript. The total line above
the list is calculated at runtime and needs no edit.

## Running it

No build step and no dependencies. It needs `http://` rather than `file://`, because
the CSS, JavaScript and fonts are referenced from the site root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Stack

Plain HTML, CSS and JavaScript. No framework, no bundler, no CDN: Calibri is
self-hosted, and the feedback form reaches EmailJS over its REST API rather than
loading their SDK. What is in git is what ships.

That form needs a live EmailJS connection. If it starts returning 412, the Gmail
grant has expired and needs reconnecting from the EmailJS dashboard.

## Author

Rohit Shukla, [github.com/rohitshukla001](https://github.com/rohitshukla001)
