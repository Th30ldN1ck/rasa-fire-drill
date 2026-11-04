// Check-in storage: a Redis list on Upstash (newest first), via its REST API.
// Vercel's Upstash integration sets KV_REST_API_* or UPSTASH_REDIS_REST_*.
// With neither set (local dev) it falls back to an in-memory list.
const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = 'checkins';
const MAX = 50000; // keep the list bounded

const memory = [];

async function redis(...command) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || `Redis ${res.status}`);
  return data.result;
}

export async function addCheckin(entry) {
  if (!URL) { memory.unshift(entry); return; }
  await redis('LPUSH', KEY, JSON.stringify(entry));
  await redis('LTRIM', KEY, 0, MAX - 1);
}

export async function listCheckins(limit = 5000) {
  if (!URL) return memory.slice(0, limit);
  const rows = await redis('LRANGE', KEY, 0, limit - 1);
  return rows.map((r) => JSON.parse(r));
}
