# SiteLab API

## GET /api/v1/health

Returns a small service health payload with ok, service and version.

## POST /api/v1/scan

Example JSON request:

~~~json
{"url":"https://example.com","limit":25,"mode":"standard"}
~~~

Standard mode supports up to 100 pages and performs deeper compliance, DNS/hosting and site-level analysis. Fast mode is capped at 12 pages, uses higher crawl concurrency and skips the most expensive compliance discovery.

The response contains target, scan time, API metadata, pages, errors, compliance, DNS/hosting site intelligence, aggregate summary and site-level issues.

Each finding may contain priority, diagnosis summary, root cause, impact, recommended fix, verification steps, evidence and a production-safe AI fix prompt.

### Site intelligence

siteIntel includes:

- DNS A, AAAA, CNAME, NS, MX and TXT records
- RDAP domain/registrar data
- RDAP network/hosting data
- domain status, registration and expiry data when published
- DNSSEC status when published

### Page intelligence

Pages can include:

- Open Graph and Twitter/X metadata
- normalized social image URLs
- detected generator/framework signals
- scripts, stylesheets, images, fonts and resource hosts
- DOM, HTML/text bytes, word count and text-to-HTML ratio

## Production endpoint

The live SiteLab API is hosted at `https://sitelab.ace-base.cc`.

Health check:

~~~bash
curl https://sitelab.ace-base.cc/api/v1/health
~~~

Example scan:

~~~bash
curl -X POST https://sitelab.ace-base.cc/api/v1/scan   -H 'content-type: application/json'   -d '{"url":"https://example.com","limit":10,"mode":"standard"}'
~~~

## Security

Only HTTP(S) targets are accepted. DNS resolution validates public destinations and pins the actual connection address. Redirects are manually followed and revalidated against the scan host scope. TLS certificate verification is enabled, response bodies are bounded, timeouts and redirect limits apply, and server-side rate limiting protects scan endpoints.
