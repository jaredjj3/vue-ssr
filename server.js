const express = require('express');
const path = require('path');
const bundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const getHandlebarsTemplates = require('./utils/getHandlebarsTemplates');
const registerHandlebarHelpers = require('./utils/registerHandlebarHelpers');
const renderPage = require('./utils/renderPage');
const renderSurrogates = require('./utils/renderSurrogates');
const applySurrogatesToStr = require('./utils/applySurrogatesToStr');

const DEFAULT_MSG = 'This text was rendered by Handlebars on the server.';

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
  // have the surrogates array as part of its context. The helper that
  // marries the mustache template with the surrogates variable is called
  // renderVueComponent. This is the mechanism by which the surrogates
  // array is populated. The html returned by the template is a string
  // that has placeholders for Vue surrogates.
  const template = templates[templateName];
  const msg = req.query.msg || DEFAULT_MSG;
  const surrogates = [];
  registerHandlebarHelpers(surrogates);
  const html = template({ msg });

  // The renderSurrogates helper populates each surrogate's html attribute
  // in place. After the promise resolves, applySurrogatesToStr takes html
  // attribute of each surrogate and inject it to the final html string that
  // is sent to the requester.
  renderSurrogates(bundle, clientManifest, surrogates)
      .then(() => {
        res.status(200).send(applySurrogatesToStr(surrogates, html));
      })
      .catch((error) => {
        if (error.code === 404) {
          res.status(404).send(`component not found: '${error.componentName}'`);
        } else {
          console.error(error.stack);
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
