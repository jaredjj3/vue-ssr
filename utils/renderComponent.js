module.exports = (renderer, component) => {
  component.url = 'foo';
  return renderer.renderToString(component).then((html) => {
    component.html = html;
    return component;
  });
};
