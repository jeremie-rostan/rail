# RAIL Strategy 2026 Website

Static multi-page website generated from `RAIL 2026 Working Document.docx`.

## Files

- `index.html`: landing page and navigation hub
- `incidents.html`: AI incident categories and examples
- `response.html`: prevention, response SOP, and consequences
- `eu-ai-act.html`: EU AI Act alignment section
- `eu-ai-act-summary.html`: EU AI Act summary section
- `data-protection-gdpr.html`: AI and Data Protection + AI and GDPR sections
- `curriculum.html`: integrated curriculum map with grade/unit filters
- `infographics.html`: dedicated page for RAIL infographic images
- `action-plan.html`: RAIL action plan section
- `full-document.html`: redirect to `action-plan.html` for backward compatibility
- `app.js`: content loading and section rendering logic
- `styles.css`: responsive K-12-friendly visual design
- `source.html`: converted HTML source used as canonical content input
- `assets/infographics/`: extracted infographic image files from DOCX

## Local preview

Use any static server from this directory. Example:

```bash
python3 -m http.server 8000
```

Then open: `http://localhost:8000/index.html`

## Deployment

This repository is compatible with static hosting platforms such as GitHub Pages, Netlify, or Vercel static hosting.
