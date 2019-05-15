const { createBundleRenderer } = require('vue-server-renderer');
const fs = require('fs');
const path = require('path');

const templatePath = path.resolve(
    __dirname,
    '../templates/index.template.html'
);
const template = fs.readFileSync(templatePath, 'utf-8');

/**
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
  // renderer.renderToString(context) passes the context to the
  // exported function of entry-server.js
  return renderer.renderToString({
    ...context,
    isPage: true,
  });
};
