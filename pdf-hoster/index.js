const fs = require("fs");
const Mustache = require("mustache");

function render(resumeObject) {
  const theme = fs.readFileSync(__dirname + "/pdf-hosting.template", "utf8");
  return Mustache.render(theme, resumeObject);
}

module.exports = { render };
