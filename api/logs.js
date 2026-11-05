import { clearCheckins, listCheckins, storage } from './_store.js';

// GET → { storage: 'redis'|'memory', checkins: [{ office, at }, …] }, newest first
// DELETE → removes every check-in
export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'DELETE') {
      await clearCheckins();
      return res.status(200).json({ ok: true });
    }
    res.status(200).json({ storage, checkins: await listCheckins() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
