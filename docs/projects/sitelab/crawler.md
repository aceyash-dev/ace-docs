# Crawler Implementation

## Limits

| Setting | Standard | Fast |
| --- | ---: | ---: |
| Default pages | 25 | 25 |
| Maximum pages | 100 | 25 |
| Concurrency | 8 | 12 |
| Discovered URLs | 300 | 300 |
| Redirects | 5 | 5 |
| Response body | 2 MB | 2 MB |
| Request timeout | 12s | 12s |

## Page evidence

Pages report HTTP status, response time, title and description lengths, canonical and robots data, language, headings, image and alt coverage, link topology, JSON-LD validity, social metadata, security headers, word count, text-to-HTML ratio, DOM size, script/style counts and byte counts.

## Findings

The analyzer detects SEO, accessibility and security issues including missing metadata, headings, labels, accessible names, canonical URLs and important security headers.

Site-level analysis also detects duplicate metadata and compliance gaps.
