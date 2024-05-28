const fs = require("fs");
const _ = require("lodash");
const gravatar = require("gravatar");
const Mustache = require("mustache");

function getMonth(startDateStr) {
  const monthMap = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };
  return monthMap[startDateStr.substr(5, 2)] || "";
}

function render(resumeObject) {
  const d = new Date();
  const curyear = d.getFullYear();

  resumeObject.basics.capitalName = resumeObject.basics.name.toUpperCase();
  if (resumeObject.basics && resumeObject.basics.email) {
    resumeObject.basics.gravatar = gravatar.url(resumeObject.basics.email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
  }
  resumeObject.photo =
    resumeObject.basics.image || resumeObject.basics.gravatar;

  resumeObject.basics.profiles.forEach((p) => {
    const network = p.network.toLowerCase();
    const specialCases = {
      "google-plus": "fab fa-google-plus",
      flickr: "fab fa-flickr",
      dribbble: "fab fa-dribbble",
      codepen: "fab fa-codepen",
      soundcloud: "fab fa-soundcloud",
      reddit: "fab fa-reddit",
      tumblr: "fab fa-tumblr",
      "stack-overflow": "fab fa-stack-overflow",
      blog: "fas fa-rss",
      gitlab: "fab fa-gitlab",
      keybase: "fas fa-key",
    };
    p.iconClass = specialCases[network] || `fab fa-${network}`;
    p.text = p.url || `${p.network}: ${p.username}`;
  });

  ["work", "volunteer"].forEach((key) => {
    if (resumeObject[key] && resumeObject[key].length) {
      resumeObject[key + "Bool"] = true;
      resumeObject[key].forEach((w) => {
        w.startDateYear = w.startDate?.substr(0, 4) || "";
        w.startDateMonth = getMonth(w.startDate || "");
        w.endDateYear = w.endDate?.substr(0, 4) || "Present";
        w.endDateMonth = getMonth(w.endDate || "");
        w.boolHighlights = w.highlights?.[0] !== "";
      });
    }
  });

  // Similar treatment for other sections...

  resumeObject.css = fs.readFileSync(__dirname + "/style.css", "utf-8");
  resumeObject.printcss = fs.readFileSync(__dirname + "/print.css", "utf-8");
  const theme = fs.readFileSync(__dirname + "/resume.template", "utf8");
  return Mustache.render(theme, resumeObject);
}

module.exports = { render };
