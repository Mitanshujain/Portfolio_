# Mitanshu Jain — Personal Portfolio

A responsive portfolio focused on software development, enterprise data workflows, analytics and machine learning. Built with plain HTML, CSS and JavaScript, using an ivory, forest-green and copper palette.

## Features

- Responsive introduction, portrait, project case studies, experience, skills and education sections.
- Keyboard-friendly mobile navigation and native expandable project summaries.
- Gmail compose links with a prefilled recipient.
- Resume download handling with a PDF viewer fallback.
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

## Add your resume privately

The original resume is intentionally excluded from this repository because it contains personal contact details. This does not change the resume on the existing hosted portfolio.

To enable resume buttons in your local copy or a separate deployment, put your PDF at `dist/assets/Mitanshu-Jain-Resume.pdf`. PDF files are ignored by Git. Upload that file directly to your chosen hosting service if you want visitors to access it, and review its contents before sharing it. Without this local file, the resume buttons cannot retrieve a PDF; the website sections and other links still work.

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

Edit the page content in `dist/index.html`, the palette and layout in `dist/styles.css`, and interactions in `dist/app.js`. A static host should serve the `dist` directory. Never publish credentials or development configuration.

## Privacy

Only the website source, portrait, tests and project documentation are included. The portrait's visible pixels are preserved while EXIF, XMP, IPTC and comment metadata are removed. The professional email and social links displayed on the portfolio are intentionally present in the source.

See [SECURITY.md](SECURITY.md) for the repository's exclusions and security notes.
