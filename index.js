// Create vue instance
const Vue = require('vue');
const vsr = require('vue-server-renderer');

const app = new Vue({
  template: `<div>Hello, world!</div>`,
});

// Render vue into HTML
const renderer = vsr.createRenderer();
renderer.renderToString(app).then((html) => {
  console.log(html);
}).catch((error) => {
  console.error(error);
});
