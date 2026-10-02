var fs = require("fs");
var path = require("path");
var Mustache = require("mustache");

var MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function monthLabel(date) {
  var month = Number(String(date || "").slice(5, 7));
  return month >= 1 && month <= 12 ? MONTHS[month - 1] + " " : "";
}

function keepHyphens(html) {
  return String(html || "").replace(/(<[^>]+>)|([A-Za-z0-9]+(?:-[A-Za-z0-9]+)+)/g, function (_, tag, word) {
    return tag || '<span class="keep">' + word + "</span>";
  });
}

function emphasize(text, phrases) {
  var safe = Mustache.escape(text || "");
  if (phrases.length && safe) {
    var pattern = new RegExp(
      phrases
        .slice()
        .sort(function (a, b) { return b.length - a.length; })
        .map(function (phrase) {
          return phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        })
        .join("|"),
      "g"
    );
    safe = safe.replace(pattern, "<strong>$&</strong>");
  }
  return keepHyphens(safe);
}

function enable(resume, key, field) {
  var items = resume[key];
  if (!Array.isArray(items) || !items.some(function (item) { return item && item[field] && !item.hidden; })) {
    return [];
  }
  resume[key + "Bool"] = true;
  return items;
}

function addRange(entry, markExpected) {
  if (entry.startDate) {
    entry.startDateYear = String(entry.startDate).slice(0, 4);
    entry.startDateMonth = monthLabel(entry.startDate);
  }
  if (entry.endDate) {
    entry.endDateYear = String(entry.endDate).slice(0, 4);
    entry.endDateMonth = monthLabel(entry.endDate);
    if (markExpected && Number(entry.endDateYear) > new Date().getFullYear()) {
      entry.endDateYear += " (expected)";
    }
  } else {
    entry.endDateYear = "Present";
    entry.endDateMonth = "";
  }
}

function displayUrl(url) {
  try {
    var parsed = new URL(url);
    var text = parsed.hostname.replace(/^www\./, "");
    if (parsed.pathname && parsed.pathname !== "/") text += parsed.pathname.replace(/\/$/, "");
    return text;
  } catch (e) {
    return url;
  }
}

function pdfFilename(resume) {
  var basics = (resume && resume.basics) || {};
  var name = String(basics.name || "resume").trim().replace(/\s+/g, "_");
  var role = String(basics.label || "").split("·")[0].trim().replace(/\s+/g, "_");
  return (role ? name + "_" + role : name) + ".pdf";
}

function render(resume) {
  var phrases = (resume.meta && resume.meta.emphasis) || [];
  var basics = resume.basics || (resume.basics = {});
  basics.formattedSummary = emphasize(basics.summary, phrases);
  basics.phoneHref = basics.phone ? "tel:" + String(basics.phone).replace(/[^\d+]/g, "") : "";
  basics.pdfFilename = pdfFilename(resume);

  (basics.profiles || []).forEach(function (profile) {
    var iconPath = path.join(__dirname, "icons", String(profile.network || "").toLowerCase() + ".svg");
    profile.iconSvg = fs.existsSync(iconPath) ? fs.readFileSync(iconPath, "utf8") : "";
    profile.displayUrl = profile.url ? displayUrl(profile.url) : (profile.username || profile.network);
  });

  enable(resume, "work", "name").forEach(function (job) {
    job.formattedHighlights = (job.highlights || []).map(function (item) {
      return emphasize(item, phrases);
    });
    job.boolHighlights = job.formattedHighlights.some(Boolean);
    addRange(job);
  });

  enable(resume, "volunteer", "organization").forEach(function (item) {
    item.boolHighlights = Array.isArray(item.highlights) && item.highlights.some(Boolean);
    addRange(item);
  });

  enable(resume, "projects", "name").forEach(function (project) {
    project.formattedDescription = emphasize(project.description, phrases);
    project.formattedHighlights = (project.highlights || []).map(function (item) {
      return emphasize(item, phrases);
    });
    project.boolHighlights = project.formattedHighlights.some(Boolean);
    if (project.url) project.displayUrl = displayUrl(project.url);
  });

  if (resume.meta && resume.meta.experiments) {
    resume.meta.experimentsUrl = displayUrl(resume.meta.experiments);
  }

  enable(resume, "education", "institution").forEach(function (item) {
    addRange(item, true);
    item.educationCourses = Array.isArray(item.courses) && item.courses.some(Boolean);
  });

  enable(resume, "awards", "title").forEach(function (item) {
    item.year = String(item.date || "").slice(0, 4);
    item.month = monthLabel(item.date);
  });

  enable(resume, "publications", "name");
  enable(resume, "skills", "name");
  enable(resume, "certificates", "name");
  enable(resume, "languages", "language");
  enable(resume, "interests", "name");
  enable(resume, "references", "name");

  resume.css = fs.readFileSync(path.join(__dirname, "style.css"), "utf8");
  resume.printcss = fs.readFileSync(path.join(__dirname, "print.css"), "utf8");
  return Mustache.render(
    fs.readFileSync(path.join(__dirname, "resume.template"), "utf8"),
    resume
  );
}

module.exports = { render: render, pdfFilename: pdfFilename };
