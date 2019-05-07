const express = require('express');
const Handlebars = require('handlebars');
const getTemplates = require('./getTemplates');
const { createRenderer } = require('vue-server-renderer');
const Vue = require('vue');

const app = express();

// handlebars
Handlebars.registerHelper('renderVueComponent', (store, name) => {
  let html;
  const renderer = createRenderer();
  const component = new Vue({
    template: `<div>{{ name }}</div>`,
    data: {
      name,
    },
  });
  renderer.renderToString(component, (error, htmlStr) => {
    if (error) {
      throw error;
    }

    html = htmlStr;
  });
  return html;
});
const templates = getTemplates('./src/templates/');

// express
app.get('/templates/:templateName', (req, res) => {
  const { templateName } = req.params;
  if (templates.hasOwnProperty(templateName)) {
    const template = templates[templateName];
    const store = 'store';
    const context = { body: 'rendered by Handlebars', store };
    const html = template(context);
    res.status(200).send(html);
  } else {
    res.status(404).send(`template '${templateName}' not found`);
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
