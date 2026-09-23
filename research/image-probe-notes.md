# Image probe notes (2026-09-23, America/Chicago)

- **Amazon scraping:** Did **not** block from this box. `amazon.com/dp/{ASIN}` returned full product HTML (~1–2.5 MB) with `hiRes` `m.media-amazon.com` URLs. Those CDN URLs returned HTTP 200 + `image/jpeg` via `curl -I` (User-Agent recommended).
- **Walmart:** Product HTML was empty/blocked for og:image extraction (anti-bot).
- **Manufacturer / retailer CDNs used:** Franklin Sports Magento media (SKU 52742); Rubbermaid/Newell Scene7 (model 2199772, serves `image/webp`). OXO.com has related utensil-organizer JPEGs; Amazon hiRes kept for exact ASIN B00IYO0RL6. Progressive/Chuckit official product image pages were not cleanly located.
- All 8 entries in `image-probe.json` verified: HTTP 200 and `Content-Type: image/*`.
