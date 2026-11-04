import { OFFICES } from '../offices.js';
import { addCheckin } from './_store.js';

// POST { office } → records { office, at } with the server's timestamp
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const office = req.body?.office;
  if (!OFFICES.includes(office)) return res.status(400).json({ error: 'Unknown office' });

  const entry = { office, at: new Date().toISOString() };
  try {
    await addCheckin(entry);
    res.status(200).json({ ok: true, entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
