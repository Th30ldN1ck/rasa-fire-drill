# Office check-in

Scan a QR, tap your office, done. Vanilla HTML/JS + two Vercel functions, no build step.

| Page | What |
|---|---|
| `/` | Check-in: tap an office, records office + server time |
| `/logs` | Log viewer: filter by date/office, counts per office, CSV export. Open to anyone with the link (`noindex`) |
| `/qr` | Printable QR pointing at `/` on whatever domain it's served from |

- `offices.js` – the office list (shared by the pages and the API, which rejects unknown offices)
- `api/checkin.js` (POST `{office}`), `api/logs.js` (GET, newest first, up to 5,000)
- `api/_store.js` – Upstash Redis list `checkins` over REST; in-memory if no env vars

## Run locally
`npm run dev` → http://localhost:8000 (in-memory storage unless `KV_REST_API_URL`/`KV_REST_API_TOKEN` are exported)

## Deploy
1. Push to GitHub and import the repo in Vercel (no framework, no build command)
2. Project → Storage → add **Upstash for Redis** (free) and connect it; it sets the `KV_REST_API_*` env vars
3. Redeploy, open `/qr`, print
