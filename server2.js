const fs = require('fs');
const path = require('path');
const express = require('express');
const Handlebars = require('handlebars');

const app = express();
const resolve = (file) => path.resolve(__dirname, file);
const srcPath = resolve('./src/templates/index.handlebars');
const src = fs.readFileSync(srcPath, 'utf-8');
const template = Handlebars.compile(src);

app.get('*', (req, res) => {
  const context = {
    title: 'Hello, world!',
    body: 'Rendered by Handlebars',
  };
  const html = template(context);
  res.send(html);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
