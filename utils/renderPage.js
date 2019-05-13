const { createBundleRenderer } = require('vue-server-renderer');
const fs = require('fs');
const path = require('path');

const templatePath = path.resolve(
    __dirname,
    '../templates/index.template.html'
);
const template = fs.readFileSync(templatePath, 'utf-8');

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
