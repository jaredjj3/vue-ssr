/**
 * Factory function for a HydrationSpec, the information needed
 * by the client to hydrate HTML.
 *
 * @param {Surrogate} surrogate
 * @return {HydrationSpec}
 */
module.exports = (surrogate) => {
  const { id, componentName, props } = surrogate;

  return {
    id,
    componentName,
    props,
  };
};
