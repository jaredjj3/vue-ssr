const uuid = require('uuid');

module.exports = (componentName, helperOptions) => {
  const id = uuid.v4();
  const placeholder = `<!-- ${id} -->`;

  return {
    placeholder,
    componentName,
    html: '',
    props: helperOptions.hash,
  };
};
