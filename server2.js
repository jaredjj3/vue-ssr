const fs = require('fs');
const path = require('path');
const express = require('express');
const Handlebars = require('handlebars');

const resolve = (file) => path.resolve(__dirname, file);

// handlebars
Handlebars.registerPartial('vueComponent', '<!--vue-ssr-outlet-->');
const templates = {};
const dir = './src/templates/';
fs.readdir(dir, (error, files) => {
  if (error) {
    throw error;
  }
  for (const file of files) {
    const srcPath = resolve(`${dir}${file}`);
    const src = fs.readFileSync(srcPath, 'utf-8');
    const filename = path.basename(srcPath, '.handlebars');
    templates[filename] = Handlebars.compile(src);
  }
});

// express
const app = express();
app.get('/templates/:templateName', (req, res) => {
  const { templateName } = req.params;
  if (templates.hasOwnProperty(templateName)) {
    const template = templates[templateName];
    const context = {
      title: 'Hello, world!',
      body: 'Rendered by Handlebars',
    };
    const html = template(context);
    res.send(html);
  } else {
    res.status(404).send(`template '${templateName}' not found`);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
