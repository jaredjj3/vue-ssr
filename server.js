const express = require('express');
const getTemplates = require('./utils/getTemplates');
const renderComponent = require('./utils/renderComponent');
const registerHandlebarHelpers = require('./utils/registerHandlebarHelpers');
const { createBundleRenderer } = require('vue-server-renderer');
const bundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');

const app = express();
const renderer = createBundleRenderer(bundle, { clientManifest });
const templates = getTemplates('./src/templates/');

app.get('/templates/:templateName', (req, res) => {
  const { templateName } = req.params;
  if (!templates.hasOwnProperty(templateName)) {
    return res.status(404).send(`template '${templateName}' not found`);
  }

  // Execute the handlebars template, which returns a string that
  // can be parsed into HTML. At this point, Vue components are
  // not rendererd yet. Instead, they have placeholders given by
  // the renderVueComponent Handlebars helper.
  const template = templates[templateName];
  const components = [];
  const body = 'rendered by Handlebars';
  let store;
  let router;

  // the renderVueComponent helper populates the components array
  registerHandlebarHelpers(components);
  let html = template({ body, store, router });

  // renderComponent returns a promise that will return a component
  // that has its html field populated with the corresponding Vue
  // component
  const renders = [];
  for (const component of components) {
    const promise = renderComponent(renderer, component);
    renders.push(promise);
  }

  // When all the Vue components are rendered, take the response
  // html and replace the placeholder comments with each component's
  // corresponding html property
  Promise.all(renders).then((components) => {
    for (const component of components) {
      html = html.replace(component.placeholder, component.html);
    }
    res.status(200).send(html);
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
