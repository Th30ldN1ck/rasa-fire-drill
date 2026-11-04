// Local dev server: static files + api/*.js handlers, like Vercel.
// Uses Upstash if KV_REST_API_URL/TOKEN are exported, else in-memory storage.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = process.env.PORT || 8000;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://x');

  if (pathname.startsWith('/api/')) {
    let body = '';
    for await (const chunk of req) body += chunk;
    req.body = body ? JSON.parse(body) : undefined;
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (data) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); };
    try {
      const mod = await import(pathToFileURL(path.join(root, pathname + '.js')));
      return await mod.default(req, res);
    } catch {
      return res.status(404).json({ error: 'Not found' });
    }
  }

  // Clean URLs: /logs → logs.html, / → index.html
  let file = pathname === '/' ? '/index.html' : pathname;
  if (!path.extname(file)) file += '.html';
  try {
    const data = await fs.readFile(path.join(root, path.normalize(file)));
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
