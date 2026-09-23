# Wholesale → Amazon

A light, paper-style **research catalog** of **16 wholesale product picks** for a **Texas LLC** exploring Amazon FBA / wholesale-to-Amazon. Built for GitHub Pages — no build step.

## What this site is for

- Product research notes with photo slots, Amazon CTAs, and ungating / wholesale cautions (not a buy list)
- **$500 starter basket** of lower-friction SKUs at the top
- Filters by category, ungating level, and search; detail modal for notes
- **Wholesale contacts** stub section ready to fill from later research
- Reminder that prices are approximate public snapshots as of **Sep 23, 2026** and must be re-checked

## Design notes

- Warm off-white / charcoal / deep teal editorial look (not a dark SaaS landing page)
- Cards use a 4:3 photo area: real `imageUrl` when present, otherwise a clean “Photo pending” placeholder
- Do **not** invent ASINs or fake image URLs — merge verified URLs from `research/` when available

## Product schema extras

Optional fields on each product (in `products.js` / `products.json`):

| Field | Purpose |
|------|---------|
| `imageUrl` | Verified product image URL, or `null` |
| `wholesaleUrl` | Distributor / dealer page, or `null` |
| `wholesaleSourceName` | Human-readable channel name, or `null` |
| `contactEmail` | Research contact, or `null` |
| `starterPick` | `true` if included in the $500 starter basket |
| `estimatedInventorySpend` | Rough first-PO inventory guess string |

## Files

| File | Purpose |
|------|---------|
| `index.html` | Layout: intro, starter basket, filters, catalog, contacts, modal |
| `styles.css` | Light editorial catalog styles (Source Serif 4 + IBM Plex Sans) |
| `app.js` | Render cards/images, starter section, filters, modal |
| `products.js` | `window.PRODUCTS` (works with `file://` and Pages) |
| `products.json` | Same catalog as portable JSON |
| `research/` | Optional later drops (`products-v2.json`, `image-probe.json`) for verified image URLs |

## Open locally

```bash
cd amazon-wholesale-picks
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

You can also open `index.html` directly. Data loads from `products.js`, so the catalog works offline without fetching `products.json`.

## Enable GitHub Pages

1. Push this folder to a GitHub repository (repo root, `/docs`, or `gh-pages`).
2. **Settings → Pages** → Source: **Deploy from a branch**.
3. Choose branch and folder, Save, then open the published URL.

No Node/npm build is required.

## Disclaimer

Not financial, legal, or selling advice. Always verify Seller Central eligibility, run Amazon’s Revenue Calculator, and require authorized invoices. Do not use fake ungating services. Faire inventory cannot be sold on Amazon.

## License

Research notes for personal / internal use. Amazon product names and trademarks belong to their respective owners.
