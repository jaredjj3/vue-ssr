const express = require('express');
const getTemplates = require('./utils/getTemplates');
const renderComponent = require('./utils/renderComponent');
const registerHandlebarHelpers = require('./utils/registerHandlebarHelpers');
const { createBundleRenderer } = require('vue-server-renderer');
const bundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const fs = require('fs');
const path = require('path');

const app = express();
const templates = getTemplates('./src/templates/');

const resolve = (file) => path.resolve(__dirname, file);
const serve = (path) => express.static(resolve(path));

app.use('/dist', serve('./dist'));
app.use('/public', serve('./public'));

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

  // the renderVueComponent helper populates the components array
  registerHandlebarHelpers(components);
  let html = template({ body });

  // renderComponent returns a promise that will return a component
  // that has its html field populated with the corresponding Vue
  // component
  const renders = [];
  renders.push(renderComponent(
      createBundleRenderer(bundle, {
        clientManifest,
      }),
      components[0]
  ));
  renders.push(renderComponent(
      createBundleRenderer(bundle, {
        clientManifest,
        template: fs.readFileSync('./src/index.template.html', 'utf-8'),
      }),
      components[1]
  ));

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
