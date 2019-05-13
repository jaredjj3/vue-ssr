module.exports = (component) => {
  const { id, componentName, props } = component;

  return {
    id,
    componentName,
    props,
  };
};
