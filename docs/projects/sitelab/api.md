# SiteLab API

## GET /api/v1/health

Returns a small service health payload with ok, service and version.

## POST /api/v1/scan

Example JSON request:

~~~json
{"url":"https://example.com","limit":25,"mode":"fast"}
~~~

Fast mode is capped at 25 pages, uses higher crawl concurrency and skips expensive compliance discovery. Standard mode supports up to 100 pages and performs the deeper compliance checks.

The service keeps a short 30-second in-memory cache keyed by target, limit and mode. The cache is bounded to 20 entries.

The response contains target, scan time, API metadata, pages, errors, compliance, aggregate summary and site-level issues.

Each finding may contain priority, diagnosis summary, root cause, impact, recommended fix, verification steps and evidence.

Example:

~~~bash
curl -X POST https://YOUR-SITELAB-HOST/api/v1/scan \
  -H 'content-type: application/json' \
  -d '{"url":"https://example.com","limit":10,"mode":"fast"}'
~~~

## Security

Only HTTP(S) targets are accepted. DNS resolution, private-address rejection, redirect limits, response-size limits and server-side rate limiting apply to API scans.
