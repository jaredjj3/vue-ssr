const { createBundleRenderer } = require('vue-server-renderer');
const fs = require('fs');
const path = require('path');

const templatePath = path.resolve(
    __dirname,
    '../templates/index.template.html'
);
const template = fs.readFileSync(templatePath, 'utf-8');

/**
 * Creates a bundle renderer which passes the context to the function
 * exported to ./src/entry-server.js.
 *
 * @param {object} bundle
 * @param {object} clientManifest
 * @param {object} context
 * @return {Promise<string>}
 */
module.exports = (bundle, clientManifest, context) => {
  const renderer = createBundleRenderer(bundle, {
    clientManifest,
    template,
  });
  return renderer.renderToString({
    ...context,
    isPage: true,
  });
};
