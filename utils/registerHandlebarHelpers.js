const Handlebars = require('handlebars');
const createComponent = require('./createComponent');

/**
 * Returns a function that will be called when Handlebars uses the
 * renderVueComponent helper. The components argument is populated
 * every time the renderVueComponent helper is called.
 *
 * @param {Component[]} components
 * @return {Function}
 */
const getHelper = (components) => (componentName, options) => {
  const component = createComponent(componentName, options.hash);
  components.push(component);
  return component.placeholder;
};

/**
 * Reregister renderVueComponent helper. Calling this function multiple
 * times reregisters the helper.
 *
 * @param {Component[]} components
 * @return {void}
 */
module.exports = (components) => {
  Handlebars.registerHelper('renderVueComponent', getHelper(components));
};
