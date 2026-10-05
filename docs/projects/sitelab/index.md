# SiteLab

SiteLab is a bounded website-intelligence crawler that turns a URL into crawl evidence, prioritized findings, and actionable diagnosis.

## Product flow

Landing → validate target → /suite?query=<encoded-url> → POST /api/v1/scan → crawl → inspect → diagnose → Suite command center.

## Capabilities

- Same-host bounded crawling
- SEO, accessibility, security, social and compliance inspection
- Response timing and content-depth metrics
- Prioritized findings with root cause, impact, fix and verification
- Fast and standard API scan modes
- Desktop command-center UI with progressive reveals
- Expandable AI Overview backed by scan diagnosis

Implementation source: aceyash-dev/sitelab.
