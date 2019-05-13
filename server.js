const bundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const express = require('express');
const getHandlebarsTemplates = require('./utils/getHandlebarsTemplates');
const injectComponents = require('./utils/injectComponents');
const path = require('path');
const registerHandlebarHelpers = require('./utils/registerHandlebarHelpers');
const renderComponents = require('./utils/renderComponents');

const app = express();
const templates = getHandlebarsTemplates('./src/templates/');

const serve = (file) => express.static(path.resolve(__dirname, file));

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
  const html = template({ body });

  // renderComponent returns a promise that will return a component
  // that has its html field populated with the corresponding Vue
  // component
  const renders = renderComponents(bundle, clientManifest, components);

  // When all the Vue components are rendered, take the response
  // html and replace the placeholder comments with each component's
  // corresponding html property
  Promise.all(renders)
      .then(() => {
        res.status(200).send(injectComponents(html, components));
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send(error);
      });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
