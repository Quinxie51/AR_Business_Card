// This set up uses Express to serve an app in Heroku server, which costs $7/month
// Please refer to the following video for source and detailed instructions
// https://www.youtube.com/watch?v=mJrmbGvsNps
const express = require('express');
const path = require('node:path');
const os = require('os');

const app = express();

process.env.NODE_ENV = 'production';

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else next();
  });
}

app.use(express.static(path.join(__dirname, '/code_source')));

app.get('*', function (request, response) {
  response.sendFile(path.join(__dirname, '/code_source', '/index.html'));
});

const PORT = process.env.PORT || 8888;

// Get local IP address
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      const { address, family, internal } = interface;
      if (family === 'IPv4' && !internal) {
        return address;
      }
    }
  }
  return '127.0.0.1';
};

app.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log(`Server running at:`);
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Network: http://${localIp}:${PORT}`);
});
