// This set up uses Express to serve an app in Heroku server, which costs $7/month
// Please refer to the following video for source and detailed instructions
// https://www.youtube.com/watch?v=mJrmbGvsNps
const express = require('express');
const path = require('node:path');

const app = express();

process.env.NODE_ENV = 'production';

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else next();
  });
}

app.use(express.static(path.join(__dirname, '/public')));

app.get('*', function (request, response) {
  response.sendFile(path.join(__dirname, '/public', '/index.html'));
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
