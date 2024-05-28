import { promises as fs } from "fs";
import * as theme from "jsonresume-theme-local";
import puppeteer from "puppeteer";
import { render } from "resumed";
import * as pdfHoster from "pdf-hoster";
import path from "path";

async function generateResume() {
  try {
    const resumePath = path.resolve("resume.json");
    const buildDir = path.resolve("./build");
    const pdfDir = path.join(buildDir, "pdf");

    // Ensure the build/pdf directory exists, creating it if necessary
    try {
      await fs.mkdir(pdfDir, { recursive: true });
    } catch (err) {
      if (err.code !== "EEXIST") {
        throw err;
      }
    }

    // Read the resume.json file
    const resumeData = await fs.readFile(resumePath, "utf-8");
    const resume = JSON.parse(resumeData);

    const outputPdfPath = path.join(
      pdfDir,
      `${resume.basics.name || resume}.pdf`
    );

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
        landscape: false,
        margin: {
          top: "10mm",
          right: "10mm",
          bottom: "10mm",
          left: "10mm",
        },
      });

      console.log(`PDF has been successfully generated as ${outputPdfPath}`);
    } catch (pageError) {
      console.error("An error occurred while generating the PDF:", pageError);
      throw pageError; // Rethrow the error to handle it later
    } finally {
      // Close the browser
      await browser.close();
    }

    // Generate PDF with pdfHoster theme
    await generatePdfWithHoster(resume, pdfDir);
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

async function generatePdfWithHoster(resume, buildDir) {
  try {
    const outputPath = path.join(buildDir, "index.html");

    // Render the resume to HTML using the pdfHoster theme
    const html = await render(resume, pdfHoster);

    // Write the HTML to the index.html file in the build/pdf directory
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

// Execute the function to generate the resume
generateResume();
