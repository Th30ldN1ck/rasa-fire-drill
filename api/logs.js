import { listCheckins } from './_store.js';

// GET → { checkins: [{ office, at }, …] }, newest first
export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ checkins: await listCheckins() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
