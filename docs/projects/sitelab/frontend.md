# Frontend Implementation

## Landing

The landing page is focused on target entry, protocol status, scan state, compact results and legal navigation. The SEO explanation block sits below the primary scan flow so it does not visually compete with the SiteLab header and scanner.

A successful target is handed to Suite through:

/suite?query=<encoded-url>

Queryless Suite entrypoints redirect back to the scanner.

## Suite

Suite reads the query parameter and automatically starts a full standard scan.

Desktop uses a wide command-center grid. Diagnostic cards use a 12-column layout at large widths and collapse progressively for tablets and phones.

The Suite has no local scan-history UI or browser scan-history storage. A small first-party cookie notice uses local browser storage only for the notice preference.

## Intelligence UI

The report includes:

- all findings with P0-P3 filtering and search
- per-finding diagnosis, root cause, impact, fix and verification
- the server-generated production-safe AI fix prompt
- visual Open Graph preview when social metadata exists
- DNS and domain/hosting intelligence
- detected technology stack
- scripts, stylesheets, images and resource-host inventory
- page-level deep metrics and crawl graph

Cards are conditionally rendered when their underlying data exists, rather than showing empty placeholders. Report rendering also normalizes incomplete API payloads so partial scan data cannot crash the diagnostic UI.

## Motion

Lenis 1.3.26 provides smooth scrolling. IntersectionObserver applies data-reveal transitions as content enters the viewport. Reduced-motion users receive the same content without motion.

## AI Overview

The floating AI control expands in place and can surface the complete finding queue. Every finding can expose its own server-generated production-safe prompt, with no hardcoded replacement prompt in the UI.
