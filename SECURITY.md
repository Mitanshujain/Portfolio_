# Security and privacy

This static website does not require API keys, access tokens, passwords, a database or a backend service.

The repository intentionally excludes:

- The original resume and other personal PDF/office documents.
- Hosting identity and access configuration.
- Local environment files, credentials and private keys.
- Development notes, private logs, deployment archives and source-hosting Git history.
- Personal location and descriptive metadata embedded in the portrait.

The professional email address and public GitHub/LinkedIn links are part of the portfolio's contact section. The portrait is included as an intended website asset.

The `.gitignore` file helps prevent future accidental additions. It does not remove sensitive information already committed or detect every possible secret. Review changes before pushing. If a credential is accidentally published, revoke it and remove it from repository history; do not paste it into an issue.
