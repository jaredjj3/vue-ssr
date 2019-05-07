const fs = require('fs');
const path = require('path');
const express = require('express');
const Handlebars = require('handlebars');

const resolve = (file) => path.resolve(__dirname, file);

// handlebars
Handlebars.registerPartial('vueComponent', '<!--vue-ssr-outlet-->');
const srcPath = resolve('./src/templates/index.handlebars');
const src = fs.readFileSync(srcPath, 'utf-8');
const template = Handlebars.compile(src);

// express
const app = express();
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
