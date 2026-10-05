# SiteLab

SiteLab is a bounded website-intelligence crawler that turns a URL into crawl evidence, prioritized findings, and actionable diagnosis.

## Product flow

Landing → validate target → /suite?query=encoded-url → POST /api/v1/scan → crawl → inspect → diagnose → Suite command center.

## Capabilities

- Same-host bounded crawling
- SEO, accessibility, security, social and compliance inspection
- Response timing and content-depth metrics
- Prioritized findings with root cause, impact, fix and verification
- Fast and standard API scan modes
- Desktop command-center UI with progressive reveals
- Expandable AI Overview backed by scan diagnosis

## Implementation

SiteLab is a small Fastify service with static frontend pages.

### Runtime

- `server.js` creates the Fastify application, global security headers, static file serving and request policy.
- `suite-routes.js` owns the Suite route and scan API.
- `rate-limit.js` provides bounded in-memory request limiting.
- `cheerio` performs server-side HTML analysis.

### Scan pipeline

1. Normalize and validate the target as HTTP(S).
2. Resolve DNS and reject private/local destinations.
3. Fetch the target with pinned public addressing and bounded redirects.
4. Read at most 2 MB per HTML response.
5. Extract page metadata, headings, images, links, security headers and compliance signals.
6. Crawl only the discovered same-host URLs within the requested page limit.
7. Enrich findings with priority, diagnosis and an AI patch prompt.
8. Return aggregate health, SEO, accessibility, social, performance and compliance data.

### Scan modes

`fast` is intended for interactive Suite scans. It caps the crawl at 25 pages, uses higher concurrency and skips the expensive extra compliance probes.

`standard` supports up to 100 pages and performs the deeper compliance checks.

A short 30-second in-memory cache is keyed by normalized target, page limit and mode. The cache is bounded to 20 entries.

## API

### GET /api/v1/health

```json
{"ok":true,"service":"sitelab-api","version":"v1"}
```

### POST /api/v1/scan

Request:

```json
{
  "url": "https://example.com",
  "limit": 25,
  "mode": "fast"
}
```

The response contains `target`, `scannedAt`, `api`, `pages`, `errors`, `compliance`, `summary` and `siteIssues`. Findings can include `priority`, `diagnosis`, `aiPrompt` and evidence.

### Security

Only HTTP(S) targets are accepted. DNS resolution, private-address rejection, redirect limits, response-size limits and server-side rate limiting apply to scans.

## Production

The live SiteLab service is hosted at https://sitelab.ace-base.cc/.

- Scanner: https://sitelab.ace-base.cc/
- Health: https://sitelab.ace-base.cc/api/v1/health
- Scan API: https://sitelab.ace-base.cc/api/v1/scan
- Suite: https://sitelab.ace-base.cc/suite?query=encoded-url

## Deployment

The SiteLab repository is source-driven and can be deployed as a Node/Fastify service. The build should use the repository root as the application root and start with `npm start`.

For the separate documentation site, see the VitePress configuration in `ace-docs`.