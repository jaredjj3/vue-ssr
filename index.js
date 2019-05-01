const Vue = require('vue');
const vsr = require('vue-server-renderer');
const fs = require('fs');
const server = require('express')();

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url,
    },
    template: `<div>The visited URL is: {{ url }}</div>`,
  });

  const renderer = vsr.createRenderer({
    template: fs.readFileSync('./index.template.html', 'utf-8'),
  });

  renderer.renderToString(app).then((html) => {
    res.end(html);
  }).catch((error) => {
    console.error(error);
    res.status(500).end('Internal Server Error');
  });
});

server.listen(8080);
