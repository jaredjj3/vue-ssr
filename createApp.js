const Vue = require('vue');

module.exports = (ctx) => {
  return new Vue({
    data: {
      url: ctx.url,
    },
    template: `<div>The visited URL is: {{ url }}</div>`,
  });
};
