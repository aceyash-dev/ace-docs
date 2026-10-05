# SiteLab Architecture

## Runtime

Fastify serves the static frontend and API routes.

~~~text
Fastify
├── static frontend
├── /suite
├── /suite-scan
└── /api/v1/*
     └── suite-routes.js
          ├── target validation
          ├── pinned HTTP(S) requests
          ├── bounded crawler
          ├── Cheerio analysis
          ├── issue prioritization
          └── diagnosis enrichment
~~~

## Request safety

1. Normalize the target.
2. Require HTTP or HTTPS.
3. Resolve DNS.
4. Reject private, local, link-local and reserved ranges.
5. Pin the resolved address for the request.
6. Validate redirected destinations.
7. Apply timeout, response-size and redirect bounds.

## Performance

The crawler processes bounded batches in parallel. Fast mode uses higher concurrency and avoids expensive compliance probes. A 30-second process-local cache avoids repeated identical scans.

## Diagnosis

Diagnosis is deterministic and evidence-derived. The core scan does not require an external LLM.

## Frontend

Landing and Suite use Instrument Sans, Instrument Serif, Hugeicons, Lenis 1.3.26 and IntersectionObserver reveals. Reduced-motion preferences disable animation.
