/**
 * Factory function for a HydrationSpec, the information needed
 * by the client to hydrate a component.
 *
 * @param {Component} component
 * @return {HydrationSpec}
 */
module.exports = (component) => {
  const { id, componentName, props } = component;

  return {
    id,
    componentName,
    props,
  };
};
