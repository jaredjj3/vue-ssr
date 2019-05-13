const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

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
