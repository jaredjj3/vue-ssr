module.exports = (html, components) => {
  for (const component of components) {
    html = html.replace(component.placeholder, component.html);
  }
  return html;
};
