module.exports = (renderer, component) => {
  const { props, store, router } = component;
  const context = { props, store, router };
  return renderer.renderToString(context).then((html) => {
    component.html = html;
    return component;
  });
};
