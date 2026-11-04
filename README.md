# Fire drill check-in · Rasa Building 2

At the assembly point people scan a QR, pick their office and confirm. Vanilla HTML/JS + two Vercel functions, no build step.

| Page | What |
|---|---|
| `/` | Check-in: tap an office, records office + server time |
| `/logs` | Roll call: offices not yet reported first, headcount per office, time since first check-in, CSV export, clear. Open to anyone with the link (`noindex`) |
| `/qr` | Printable assembly-point poster with a QR pointing at `/` on whatever domain it's served from |

- `offices.js` – building name + the 16 offices (shared by the pages and the API, which rejects unknown offices)
- `api/checkin.js` (POST `{office}`), `api/logs.js` (GET, newest first, up to 5,000)
- `api/_store.js` – Upstash Redis list `checkins` over REST; in-memory if no env vars

## Run locally
`npm run dev` → http://localhost:8000 (in-memory storage unless `KV_REST_API_URL`/`KV_REST_API_TOKEN` are exported)

## Deploy
1. Push to GitHub and import the repo in Vercel (no framework, no build command)
2. Project → Storage → add **Upstash for Redis** (free) and connect it; it sets the `KV_REST_API_*` env vars
3. Redeploy, open `/qr`, print
