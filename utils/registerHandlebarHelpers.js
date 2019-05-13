const Handlebars = require('handlebars');
const createComponent = require('./createComponent');

const getHelper = (components) => (componentName, options) => {
  const component = createComponent(componentName, options.hash);
  components.push(component);
  return component.placeholder;
};

module.exports = (components) => {
  Handlebars.registerHelper('renderVueComponent', getHelper(components));
};
