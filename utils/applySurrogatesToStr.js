/**
 * Returns an html string that has the surrogates' placeholders replaced
 * by their corresponding html attribute.
 *
 * @param {Surrogate[]} surrogates
 * @param {string} str
 * @return {string}
 */
module.exports = (surrogates, str) => {
  for (const surrogate of surrogates) {
    str = str.replace(surrogate.placeholder, surrogate.html);
  }
  return str;
};
