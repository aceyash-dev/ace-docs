# SiteLab Documentation

> Website diagnostics, SEO, security, accessibility, network and compliance intelligence.

## Product flow

`/` → validate target → `/suite?query=<encoded-url>` → automatic crawl → evidence → diagnosis.

Landing stays focused. Suite owns deep diagnostic panels, page inspection, crawl intelligence, performance, security and the expandable AI Overview.

## Motion

SiteLab uses **Lenis 1.3.26** for smooth native scrolling and an IntersectionObserver reveal layer for progressive content entry. Users with reduced-motion preferences bypass the animation layer.

## Suite scan

`GET /suite-scan?url=<url>&limit=25`

Limits:
- 25 pages by default
- 100 pages maximum
- 4 concurrent requests
- 300 discovered URLs
- 5 redirects
- 2 MB response bodies
- 6 scans/minute/client on the Suite scan route

## Public API v1

### POST /api/v1/scan

Request:

```json
{
  "url": "https://example.com",
  "limit": 25
}
```

The response contains crawled pages, page evidence, prioritized issues, deeper diagnosis, compliance signals, aggregate SEO/accessibility/social/security metrics, performance statistics and crawl errors.

The endpoint is rate-limited to 10 scan requests/minute/client and uses the same outbound URL validation and crawler bounds as Suite.

### GET /api/v1/health

Returns:

```json
{
  "ok": true,
  "service": "sitelab-api",
  "version": "v1"
}
```

## Diagnosis model

Findings can include:

- `priority`: P0–P3
- `diagnosis.summary`
- `diagnosis.rootCause`
- `diagnosis.impact`
- `diagnosis.fix`
- `diagnosis.verify`
- `diagnosis.evidence`
- `aiPrompt`

Diagnosis is derived from scan evidence and the detected issue code. It is intentionally bounded rather than pretending a missing header is an oracle for the entire internet. Humanity has enough fake certainty already.

## Page evidence

Each crawled page exposes deeper measurements including response status/time, title and description lengths, canonical and robots data, heading counts, image/alt coverage, link topology, JSON-LD validity, social metadata, security headers, word count, text-to-HTML ratio, DOM element count, script count, stylesheet count, and raw HTML/text byte counts.

## Security

Outbound targets are restricted to HTTP(S), DNS-resolved before requests, blocked when they resolve to private/local/link-local ranges, revalidated after redirects, bounded by response and redirect limits, and rate-limited server-side.

## UI routes

- `/` landing scanner
- `/suite?query=<encoded-url>` deep scanner
- `/privacy.html`
- `/cookie-policy.html`
- `/terms.html`

## Development

```bash
npm install
npm test
npm start
```

The project is a Fastify service with static HTML interfaces and no database requirement for the core scan flow.
