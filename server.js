const express = require('express');
const Handlebars = require('handlebars');
const getTemplates = require('./getTemplates');
const { createBundleRenderer } = require('vue-server-renderer');
const bundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const { JSDOM } = require('jsdom');
const { document } = (new JSDOM('')).window;
global.document = document;

const RENDER_VUE_COMPONENT = 'data-render-vue-component';
const COMPONENT_NAME = 'data-component-name';
const COMPONENT_PROPS = 'data-component-props';
const app = express();

const renderer = createBundleRenderer(bundle, {
  clientManifest,
});
const render = (d, src, name, props) => {
  return renderer.renderToString({ name, props }).then((html) => {
    const div = d.createElement('div');
    div.innerHTML = html;
    src.parentNode.replaceChild(div, src);
  });
};

// handlebars
Handlebars.registerHelper('renderVueComponent', (name, props) => {
  const div = document.createElement('div');
  div.setAttribute(RENDER_VUE_COMPONENT, true);
  div.setAttribute(COMPONENT_NAME, name);
  div.setAttribute(COMPONENT_PROPS, JSON.stringify(props));
  return div.outerHTML;
});
const templates = getTemplates('./src/templates/');

// express
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
  const context = { body: 'rendered by Handlebars' };
  const html = template(context);

  // Parse the html, and determine which vue components to render.
  // Do not send a response until all of the VueComponents successfully
  // render.
  const doc = new JSDOM(html).window.document;
  const placeholders = doc.querySelectorAll(`[${RENDER_VUE_COMPONENT}]`);
  const store = {};
  const promises = [];
  for (const placeholder of placeholders) {
    const promise = render(doc, placeholder, 'Foo', store);
    promises.push(promise);
  }

  Promise.all(promises).then(() => {
    res.status(200).send(doc.documentElement.outerHTML);
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
