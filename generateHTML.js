import { promises as fs } from "fs";
import * as theme from "jsonresume-theme-local";
import { render } from "resumed";
import path from "path";

async function generateHTML() {
  try {
    const resumePath = path.resolve("resume.json");
    const buildDir = path.resolve("./build");
    const outputPath = path.join(buildDir, "index.html");

    // Read the resume.json file
    const resumeData = await fs.readFile(resumePath, "utf-8");
    const resume = JSON.parse(resumeData);

    // Render the resume to HTML using the specified theme
    const html = await render(resume, theme);

    // Create the build directory if it doesn't exist
    await fs.mkdir(buildDir, { recursive: true });

    // Write the HTML to the index.html file in the build directory
    await fs.writeFile(outputPath, html);

    console.log(`Resume HTML has been successfully written to ${outputPath}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("File not found:", error.path);
    } else if (error.name === "SyntaxError") {
      console.error("Invalid JSON format in resume.json:", error.message);
    } else {
      console.error("An error occurred:", error.message);
    }
  }
}

generateHTML();
