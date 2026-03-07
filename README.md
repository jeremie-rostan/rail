# RAIL Strategy 2026 Website

Static multi-page website generated from `RAIL 2026 Working Document.docx`.

## Files

- `index.html`: landing page and navigation hub
- `incidents.html`: AI incident categories and examples
- `response.html`: prevention, response SOP, and consequences
- `eu-ai-act.html`: EU AI Act alignment section
- `curriculum.html`: integrated curriculum map with grade/unit filters
- `full-document.html`: full source document in one page
- `app.js`: content loading, search highlighting, jump links, curriculum filters
- `styles.css`: responsive K-12-friendly visual design
- `source.html`: converted HTML source used as canonical content input

## Local preview

Use any static server from this directory. Example:

```bash
python3 -m http.server 8000
```

Then open: `http://localhost:8000/index.html`

## Deployment

This repository is compatible with static hosting platforms such as GitHub Pages, Netlify, or Vercel static hosting.
