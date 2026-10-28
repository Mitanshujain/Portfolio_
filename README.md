# Mitanshu Jain — Personal Portfolio

A responsive portfolio focused on software development, enterprise data workflows, analytics and machine learning. Built with plain HTML, CSS and JavaScript, using an ivory, forest-green and copper palette.

## Features

- Responsive introduction, portrait, project case studies, experience, skills and education sections.
- Keyboard-friendly mobile navigation and native expandable project summaries.
- Gmail compose links with a prefilled recipient.
- Resume requests through Gmail, keeping the original PDF out of the public repository.
- Reduced-motion support, descriptive image text and visible keyboard focus.
- Local assets and no external JavaScript dependencies.

## Run locally

Requirements: Python 3 to preview; Node.js to run the optional tests.

```sh
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`.

```sh
node --test tests/resume-download.test.cjs
```

## Resume privacy

The original resume is intentionally excluded because it contains personal contact details. The public website uses **Request resume** links that open Gmail with a prefilled subject. The original resume and private hosted version are unchanged.

The optional PDF download handler in `dist/app.js` remains available for a private/custom deployment. It is only attached to links marked `data-resume-download`; no such links are enabled in this public page. Never commit a personal PDF without reviewing its contents.

## GitHub Pages

This repository publishes the `docs` folder from the `main` branch. Edit source files in `dist`, then regenerate the public copy before committing:

```sh
python3 scripts/prepare-pages.py
```

The generator copies only the website files, excludes private PDFs and creates `.nojekyll` for static hosting.

## Project structure

```text
dist/
  index.html                  Page content
  styles.css                  Design and responsive layout
  app.js                      Navigation and resume handling
  assets/
    favicon.svg               Site icon
    mitanshu-jain.jpg          Portrait with personal metadata removed
    README.md                 Resume asset instructions
tests/
  resume-download.test.cjs     Download and fallback checks
```

Edit the page content in `dist/index.html`, the palette and layout in `dist/styles.css`, and interactions in `dist/app.js`. A static host can serve the `dist` directory; GitHub Pages serves the generated `docs` directory. Never publish credentials or development configuration.

## Privacy

Only the website source, portrait, tests and project documentation are included. The portrait's visible pixels are preserved while EXIF, XMP, IPTC and comment metadata are removed. The professional email and social links displayed on the portfolio are intentionally present in the source.

See [SECURITY.md](SECURITY.md) for the repository's exclusions and security notes.
