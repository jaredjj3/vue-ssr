const express = require('express');
const Handlebars = require('handlebars');
const getTemplates = require('./getTemplates');
const { createBundleRenderer } = require('vue-server-renderer');
const bundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');

const app = express();

const renderer = createBundleRenderer(bundle, {
  clientManifest,
});

// handlebars
Handlebars.registerHelper('renderVueComponent', function(store, name) {
  return renderer.renderToString({}, (error, html) => {
    if (error) {
      throw error;
    }
    return html;
  });
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
