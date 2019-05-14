const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

/**
 * Scans the dir provided and loads all files with a .mustache basename.
 *
 * @param {string} dir
 * @return {object}
 */
module.exports = (dir) => {
  const templates = {};
  fs.readdir(dir, (error, fileNames) => {
    if (error) {
      throw error;
    }
    for (const fileName of fileNames) {
      const srcPath = path.resolve(dir, fileName);
      const src = fs.readFileSync(srcPath, 'utf-8');
      const templateName = path.basename(srcPath, '.mustache');
      templates[templateName] = Handlebars.compile(src);
    }
  });
  return templates;
};
