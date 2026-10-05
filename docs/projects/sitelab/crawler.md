# Crawler Implementation

## Scan model

SiteLab starts every crawl at the site root, then seeds the requested target URL and bounded sitemap URLs when available. Sitemap locations are discovered from common sitemap paths and `robots.txt`. Target input is length-bounded, credentials are rejected, and only ports 80/443 are accepted, including after redirects. The crawler stays within the validated host scope, follows same-host links, normalizes URLs, ignores non-HTML responses, and keeps a bounded queue. The root-first behavior makes a deep URL useful without turning the scan into a single-page inspection.

## Limits

| Setting | Standard | Fast |
| --- | ---: | ---: |
| Default pages | 25 | 12 |
| Maximum pages | 100 | 12 |
| Concurrency | 8 | 12 |
| Discovered URLs | 300 | 300 |
| Redirects | 5 | 5 |
| Response body | 2 MB | 2 MB |
| Request timeout | 12s | 12s |

Responses using gzip, Brotli or deflate are decoded before HTML analysis while the 2 MB inspection limit remains enforced.

## Page evidence

Pages report HTTP status, response time, content type, response/cache validators, title and description lengths, charset, canonical and robots data, language, headings, image and alt coverage, link topology, JSON-LD validity, Open Graph and Twitter/X metadata, security headers, word count, text-to-HTML ratio, DOM size, script/style counts, resource inventory including fonts, technology signals and byte counts.

## Site intelligence

The scan also performs DNS and public RDAP lookups for domain and hosting context. DNS A, AAAA, CNAME, NS, MX and TXT records are surfaced when available, alongside registrar, registration dates, DNSSEC, network range, organization and country.

## Findings

The analyzer reports every discovered finding, not only a top-three summary. Missing SEO, social, accessibility, security and trust signals receive an evidence-backed diagnosis and a production-safe AI fix prompt.

Duplicate titles, descriptions and canonicals are analyzed at site level. The crawler also reports broken internal links when a discovered target returns an HTTP error, and flags missing charset declarations and cross-origin canonicals.

## SSRF and crawl hardening

Targets are normalized to HTTP(S), DNS answers are resolved and pinned to validated public addresses, private/local destinations are rejected, DNS resolution is time-bounded, target URLs are length- and port-bounded, and every redirect is revalidated against the scan host scope. Redirect chains are bounded and TLS certificate verification is enabled.

The crawler never follows arbitrary external links as crawl targets. Sitemap seeds are restricted to the validated host scope, non-HTML resources are excluded from page analysis, and response bodies are size- and time-bounded.
