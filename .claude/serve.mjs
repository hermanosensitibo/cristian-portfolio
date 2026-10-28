// Serves the site folder for local preview. Usage: node .claude/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, resolve, sep } from 'node:path';
const root = resolve(import.meta.dirname, '..'), port = +process.argv[2] || 4173;
const types = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml','.pdf': 'application/pdf', '.md': 'text/plain; charset=utf-8' };
createServer(async (req, res) => {
  let path;
  try { path = resolve(join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname))); }
  catch { res.writeHead(400).end(); return; }
  if (path !== root && !path.startsWith(root + sep)) { res.writeHead(403).end(); return; } // no escaping the site folder
  const file = path === root || req.url.split('?')[0].endsWith('/') ? join(path, 'index.html') : path;
  try { const body = await readFile(file); res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }).end(body); }
  catch { res.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`http://localhost:${port}`));
