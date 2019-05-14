const bundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const express = require('express');
const getHandlebarsTemplates = require('./utils/getHandlebarsTemplates');
const injectComponents = require('./utils/injectComponents');
const path = require('path');
const registerHandlebarHelpers = require('./utils/registerHandlebarHelpers');
const renderComponents = require('./utils/renderComponents');
const renderPage = require('./utils/renderPage');

// setup
const app = express();
const templates = getHandlebarsTemplates('./templates/');
const serve = (file) => express.static(path.resolve(__dirname, file));
app.use('/dist', serve('./dist'));
app.use('/public', serve('./public'));

/**
 * This action renders Vue components within a mustache template.
 *
 * @param {String} templateName the mustache template name in ./templates
 * @returns {String}
 */
app.get('/templates/:templateName', (req, res) => {
  res.setHeader('Content-Type', 'text/html');

  // Respond with a 404 if the templateName is not in templates
  const { templateName } = req.params;
  if (!templates.hasOwnProperty(templateName)) {
    return res.status(404).send(`template not found: '${templateName}'`);
  }

  // Before rendering the Handlebars template, register new helpers that
  // have the components array as part of its context. The helper that
  // marries the mustache template with the components variable is called
  // renderVueComponent. This is the mechanism by which the components
  // array is populated. The html returned by the template is a string
  // that has placeholders for Vue components.
  const template = templates[templateName];
  const msg = 'This text was rendered by Handlebars on the server.';
  const context = { msg };
  const components = [];
  registerHandlebarHelpers(components);
  const html = template(context);

  // The renderComponents helper populates each component's html attribute
  // in place. After the promise resolves, injectComponents takes the html
  // and placeholder attributes to inject the Vue components markup into
  // the html that's returned to the caller.
  renderComponents(bundle, clientManifest, components)
      .then(() => {
        res.status(200).send(injectComponents(html, components));
      })
      .catch((error) => {
        if (error.code === 404) {
          res.status(404).send(`component not found: '${error.componentName}'`);
        } else {
          res.status(500).send(error.message);
        }
      });
});

/**
 * This action takes the url from the request, passes it to a Vue App
 * instance with a router, and updates the router. The Vue instance is
 * responsible for all rendering.
 *
 * @returns {String}
 */
app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html');

  const context = {
    url: req.url,
  };
  renderPage(bundle, clientManifest, context)
      .then((html) => {
        res.status(200).send(html);
      })
      .catch((error) => {
        if (error.url) {
          res.redirect(error.url);
        } else if (error.code === 404) {
          res.status(404).send('404 Page Not Found');
        } else {
          console.error(`error during render: ${req.url}`);
          console.error(error.stack);
          res.status(500).send('500 Internal Server Error');
        }
      });
});

// run server
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
