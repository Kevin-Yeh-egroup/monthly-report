# Codex Report Publish Package

Generated: 2026-05-22 18:28:01 +08:00
Publication update: 2026-05-22 public-production deployment

## Status

- Public production package.
- Publicly viewable on Vercel production.
- Search indexing is discouraged with robots.txt and X-Robots-Tag headers.
- Workflow: cross-device-static-v2.

## Production URL

- Root: https://publish-ready-eight.vercel.app/
- Report entrance: https://publish-ready-eight.vercel.app/reports/regular-report-system/index.html
- Deployment URL: https://publish-ready-8ar4oc2jn-egroup-task3s-projects.vercel.app

HTTP verification on 2026-05-22 returned 200 OK for the root, report entrance, and robots.txt. The root and report entrance responses included `X-Robots-Tag: noindex, nofollow`.

## Default Sensitivity

public-production

Kevin approved this report entrance for public production release. The package still contains operating reports and workflow records, so do not treat noindex as privacy.

## Entry

Open reports/regular-report-system/index.html.

## Cross-Device Route

This is a pure static package. For another device, use an approved private-preview route such as a protected Vercel deployment or another Kevin-approved static host. Do not add app-level Basic Auth middleware to this no-framework static package; a previous attempt authenticated correctly but fell through to Vercel 404 after auth.

## Publishing Rule

Before changing or replacing the production deployment, run reader review, visual review, sensitivity classification, and Kevin approval. GitHub private storage, robots.txt, noindex headers, and obscure URLs are not access control.
