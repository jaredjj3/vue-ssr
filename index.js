const createApp = require('./createApp');
const fs = require('fs');
const server = require('express')();
const vsr = require('vue-server-renderer');

server.get('*', (req, res) => {
  const app = createApp({
    url: req.url,
  });

  const renderer = vsr.createRenderer({
    template: fs.readFileSync('./index.template.html', 'utf-8'),
  });

  renderer.renderToString(app, {
    title: 'I AM TITLE',
  }).then((html) => {
    res.end(html);
  }).catch((error) => {
    console.error(error);
    res.status(500).end('Internal Server Error');
  });
});

server.listen(8080);
