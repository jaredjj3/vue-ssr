const uuid = require('uuid');

/**
 * Factory function for a surrogate, which tracks the information
 * needed to inject Vue components strings into an html string.
 *
 * @param {string} componentName
 * @param {object} props
 * @return {Component}
 */
module.exports = (componentName, props) => {
  const id = `s-${uuid.v4()}`;
  const placeholder = `<!-- ${id} -->`;

  return {
    id,
    placeholder,
    componentName,
    props,
    html: '',
  };
};
