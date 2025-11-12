const http = require('http');
const data = JSON.stringify({ username: 'admin', password: 'admin123' });

function post(cb) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      try {
        const json = JSON.parse(body);
        cb(null, json);
      } catch (e) {
        cb(e);
      }
    });
  });

  req.on('error', (err) => cb(err));
  req.write(data);
  req.end();
}

post((err, r1) => {
  if (err) return console.error('ERR1', err.message || err);
  console.log('TOKEN1:', r1.token);
  setTimeout(() => {
    post((err2, r2) => {
      if (err2) return console.error('ERR2', err2.message || err2);
      console.log('TOKEN2:', r2.token);
    });
  }, 300);
});
