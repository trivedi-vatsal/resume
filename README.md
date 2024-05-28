# Resume Generator

A project to generate HTML and PDF versions of a resume using a JSON Resume theme and Puppeteer.

## Table of Contents

- [Resume Generator](#resume-generator)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
    - [Initialize](#initialize)
    - [Start](#start)
    - [Generate HTML](#generate-html)
    - [Generate PDF](#generate-pdf)
    - [Build](#build)
  - [Contributing](#contributing)
  - [License](#license)
  - [References](#references)

## Introduction

This project allows you to create and manage your resume in a JSON format, and generate both HTML and PDF versions using a custom JSON Resume theme and Puppeteer.

## Features

- Easy to use CLI for managing resume content.
- Generate a styled HTML version of your resume.
- Generate a PDF version of your resume using Puppeteer.
- Customize the theme to fit your needs.

## Getting Started

### Prerequisites

- Node.js (>= 14.0.0)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/trivedi-vatsal/resume-generator.git
   cd resume-generator
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

## Usage

### Initialize

To initialize a new resume, run:

```sh
npm run init
```

This will create a `resume.json` file where you can add your resume data.

### Start

To start the local server and preview your resume with the custom theme, run:

```sh
npm start
```

### Generate HTML

To generate an HTML version of your resume, run:

```sh
npm run generate:html
```

The generated HTML file will be saved to `./build/index.html`.

### Generate PDF

To generate a PDF version of your resume, run:

```sh
npm run generate:pdf
```

The generated PDF file will be saved to `./build/resume.pdf`.

### Build

To generate both HTML and PDF versions of your resume, run:

```sh
npm run build
```

This will execute both the `generate:html` and `generate:pdf` scripts.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## References

- Built using [resumed](https://www.npmjs.com/package/resumed)
- Based on the [JSON Resume](https://jsonresume.org) schema
- PDF generation powered by [Puppeteer](https://pptr.dev/)
- Custom theme inspired by [jsonresume-theme-kendall](https://github.com/LinuxBozo/jsonresume-theme-kendall)

---

Made with ❤️ by [Vatsal Trivedi](https://github.com/trivedi-vatsal)