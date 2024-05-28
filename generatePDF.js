import { promises as fs } from "fs";
import * as theme from "jsonresume-theme-local";
import puppeteer from "puppeteer";
import { render } from "resumed";
import path from "path";

async function generateResume() {
  try {
    const resumePath = path.resolve("resume.json");
    const buildDir = path.resolve("./build");
    const outputPdfPath = path.join(buildDir, "resume.pdf");

    // Read the resume.json file
    const resumeData = await fs.readFile(resumePath, "utf-8");
    const resume = JSON.parse(resumeData);

    // Render the resume to HTML using the specified theme
    const html = await render(resume, theme);

    // Launch Puppeteer and create a new page
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });
    const page = await browser.newPage();

    try {
      // Set the HTML content and wait for it to load completely
      await page.setContent(html, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Generate a PDF from the rendered HTML
      await page.pdf({
        path: outputPdfPath,
        format: "a4",
        printBackground: true,
        landscape: false,
      });

      console.log(`PDF has been successfully generated as ${outputPdfPath}`);
    } catch (pageError) {
      console.error("An error occurred while generating the PDF:", pageError);
    } finally {
      // Close the browser
      await browser.close();
    }
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

// Execute the function to generate the resume
generateResume();
