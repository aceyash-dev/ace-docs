# Crawler Implementation

## Scan model

SiteLab starts every crawl from the site root and the requested target URL. The crawler stays within the validated host scope, follows same-host links, and keeps a bounded queue. The root-first behavior makes a deep URL useful without turning the scan into a single-page inspection.

## Limits

| Setting | Standard | Fast |
| --- | ---: | ---: |
| Default pages | 25 | 25 |
| Maximum pages | 100 | 12 |
| Concurrency | 8 | 12 |
| Discovered URLs | 300 | 300 |
| Redirects | 5 | 5 |
| Response body | 2 MB | 2 MB |
| Request timeout | 12s | 12s |

Responses using gzip, Brotli or deflate are decoded before HTML analysis while the 2 MB inspection limit remains enforced.

## Page evidence

Pages report HTTP status, response time, title and description lengths, canonical and robots data, language, headings, image and alt coverage, link topology, JSON-LD validity, Open Graph and Twitter/X metadata, security headers, word count, text-to-HTML ratio, DOM size, script/style counts, resource inventory, technology signals and byte counts.

## Site intelligence

The scan also performs DNS and public RDAP lookups for domain and hosting context. DNS A, AAAA, CNAME, NS, MX and TXT records are surfaced when available, alongside registrar, registration dates, DNSSEC, network range, organization and country.

## Findings

The analyzer reports every discovered finding, not only a top-three summary. Missing SEO, social, accessibility, security and trust signals receive an evidence-backed diagnosis and a production-safe AI fix prompt.

Duplicate titles, descriptions and canonicals are analyzed at site level.

## SSRF and crawl hardening

Targets are normalized to HTTP(S), DNS answers are resolved and pinned to validated public addresses, private/local destinations are rejected, and every redirect is revalidated against the scan host scope. Redirect chains are bounded and TLS certificate verification is enabled.

The crawler never follows arbitrary external links as crawl targets, and response bodies are size- and time-bounded.
