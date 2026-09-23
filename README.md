# Wholesale → Amazon

A beautiful static research catalog of **16 wholesale product picks** for a **Texas LLC** exploring Amazon FBA / wholesale-to-Amazon. Built for GitHub Pages — no build step.

## What this site is for

- Editorial product research notes (not a buy list or financial advice)
- Quick filters by category, ungating level, and search
- ASIN-accurate Amazon links plus wholesale notes and cautions
- Reminder that prices are approximate public snapshots as of **2026-09-23** and must be re-checked

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure, hero, filters, modal shell |
| `styles.css` | Charcoal / amber editorial design (Fraunces + DM Sans) |
| `app.js` | Client-side render, filters, modal |
| `products.js` | `window.PRODUCTS` data (works with `file://` and Pages) |
| `products.json` | Same catalog as portable JSON |

## Open locally

**Recommended (avoids `file://` quirks):**

```bash
cd amazon-wholesale-picks
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

You can also open `index.html` directly in a browser. Data loads from `products.js`, so the catalog works offline without a fetch to `products.json`.

## Enable GitHub Pages

1. Push this folder to a GitHub repository (as the repo root, or as a `/docs` folder, or from a `gh-pages` branch).
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**.
4. Choose the branch and folder (`/` or `/docs`), then Save.
5. After a minute or two, open the published URL.

No Node/npm build is required — Pages serves the static files as-is.

## Disclaimer

Not financial, legal, or selling advice. Always verify Seller Central eligibility, run Amazon’s Revenue Calculator, and require authorized invoices. Do not use fake ungating services. Faire inventory cannot be sold on Amazon.

## License

Research notes for personal / internal use. Amazon product names and trademarks belong to their respective owners.
