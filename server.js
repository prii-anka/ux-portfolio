const http = require('http');
const fs = require('fs');
const path = require('path');
const root = 'd:/SA ASU/ux-portfolio';
const mime = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.mp4':'video/mp4','.gif':'image/gif','.svg':'image/svg+xml','.ico':'image/x-icon','.webp':'image/webp'};
http.createServer((req, res) => {
  let p = path.join(root, req.url === '/' ? 'index.html' : decodeURIComponent(req.url).split('?')[0]);
  const ext = path.extname(p).toLowerCase();
  fs.readFile(p, (err, data) => {
    if(err){ res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type': mime[ext]||'application/octet-stream','Cache-Control':'no-store, no-cache, must-revalidate'});
    res.end(data);
  });
}).listen(3001, () => console.log('Server running at http://localhost:3001'));
