import { promises as fs } from "fs";

function generateResumeMarkdown() {
  const generatedOn = new Date();
  const formattedGeneratedOn = generatedOn
    .toISOString()
    .replace("T", " ")
    .replace(/\..+/, ""); // Format: yyyy-mm-dd HH:MM:SS

  return `# Resume \n\n| Generated on    |\n| -------- |\n| ${formattedGeneratedOn}|\n`;
}

// Generate README content
const readmeContent = generateResumeMarkdown();

// Write README.md file to the build folder
fs.writeFile("./build/README.md", readmeContent, (err) => {
  if (err) {
    console.error("Error writing README.md:", err);
    return;
  }
  console.log("README.md has been successfully generated.");
});

// Print a success message
console.log("README.md has been successfully generated.");
