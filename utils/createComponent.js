const uuid = require('uuid');

module.exports = (componentName, props) => {
  const id = `vc-${uuid.v4()}`;
  const placeholder = `<!-- ${id} -->`;

  return {
    id,
    placeholder,
    componentName,
    props,
    html: '',
  };
};
