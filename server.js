const express = require('express');
const Handlebars = require('handlebars');
const getTemplates = require('./getTemplates');
const { createBundleRenderer } = require('vue-server-renderer');
const bundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const uuid = require('uuid');

const app = express();

const renderer = createBundleRenderer(bundle, {
  clientManifest,
});
const render = (component) => {
  const { props, store, router } = component;
  const context = { props, store, router };
  return renderer.renderToString(context).then((html) => {
    component.html = html;
    return component;
  });
};

// handlebars
const getRenderVueComponent = (components) => (name, options) => {
  const id = uuid.v4();
  const placeholder = `<!-- ${id} -->`;
  components.push({
    placeholder,
    html: '',
    props: options.hash,
    store: options.data.store,
    router: options.data.router,
  });
  return placeholder;
};
const registerHandlebarHelpers = (components) => {
  Handlebars.registerHelper(
      'renderVueComponent',
      getRenderVueComponent(components)
  );
};
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
  const components = [];
  const body = 'rendered by Handlebars';
  const store = 'store';
  const router = 'router';
  registerHandlebarHelpers(components);
  let html = template({ body, store, router });

  // Parse the html, and determine which vue components to render.
  // Do not send a response until all of the VueComponents successfully
  // render.
  const promises = [];
  for (const component of components) {
    const promise = render(component);
    promises.push(promise);
  }

  Promise.all(promises).then((components) => {
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
