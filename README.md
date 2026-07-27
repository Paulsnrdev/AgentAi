
# AgentAI — Marketing Website

A single-page marketing site for AgentAI, a fictional AI consultancy (Your AI Sprint Team On Demand). Built with plain HTML, CSS, and vanilla JavaScript. No build step, no dependencies.


## Preview

Open [index.html](index.html) directly in a browser, or serve the folder locally:

```bash
npx serve .
# or
python -m http.server 8000
```

## Project Structure

```
.
├── index.html   # Page markup and content (nav, hero, about, services, works, contact, footer)
├── styles.css   # All styling, layout, and animations
├── script.js    # Interactivity (see below)
└── img/         # SVG illustrations for case study cards
```

## Features

- **Sticky nav** with scroll progress bar and active-section highlighting
- **Mobile drawer menu** with keyboard (Esc) and overlay dismissal
- **Animated hero** with a decorative "jelly" blob and animated stat counters
- **Accordion service cards** (expand/collapse with keyboard support)
- **Case studies grid** ("Works") with hover reveal of results
- **Contact form** with inline client-side validation and toast notifications on submit (no backend — form submission is simulated)
- Scroll-triggered reveal animations via `IntersectionObserver`

## Development

There's no build tooling — edit `index.html`, `styles.css`, or `script.js` directly and refresh the browser. Section anchors (`#home`, `#services`, `#works`, `#about`, `#contact`) drive both the nav links and scroll-spy highlighting, so keep `id` attributes and `data-scroll` links in sync if you rename a section.

## Notes

- Social links, "View all projects", and footer legal links are placeholders (`href="#"`).
- Client logos in the logo bar and hero card are placeholder text (`Logoipsum`, etc.), not real partners.
