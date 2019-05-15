const Handlebars = require('handlebars');
const createSurrogate = require('./createSurrogate');

/**
 * Returns a function that will be called when Handlebars uses the
 * renderVueComponent helper. The surrogates argument is populated
 * every time the renderVueComponent helper is called.
 *
 * @param {Surrogate[]} surrogates
 * @return {Function}
 */
const getRenderVueComponent = (surrogates) => (componentName, options) => {
  const surrogate = createSurrogate(componentName, options.hash);
  surrogates.push(surrogate);
  return surrogate.placeholder;
};

/**
 * Reregister renderVueComponent helper. Calling this function multiple
 * times reregisters the helper.
 *
 * @param {Surrogate[]} components
 * @return {void}
 */
module.exports = (components) => {
  Handlebars.registerHelper(
      'renderVueComponent',
      getRenderVueComponent(components)
  );
};
