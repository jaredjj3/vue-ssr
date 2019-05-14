/**
 * Returns an html string that has the components' placeholders replaced
 * by their corresponding html attribute.
 *
 * @param {string} html
 * @param {Component[]} components
 * @return {string}
 */
module.exports = (html, components) => {
  for (const component of components) {
    html = html.replace(component.placeholder, component.html);
  }
  return html;
};
