// Create vue instance
const Vue = require('vue');
const vsr = require('vue-server-renderer');

const app = new Vue({
  template: `<div>Hello, world!</div>`,
});

// Create renderer
const renderer = vsr.createRenderer();

// Render vue into HTML
renderer.renderToString(app).then((html) => {
  console.log(html);
}).catch((error) => {
  console.error(error);
});
