# Frontend Implementation

## Landing

The landing page is deliberately focused on target entry, protocol status, scan state, compact results and legal navigation.

A successful target is handed to Suite through:

/suite?query=<encoded-url>

## Suite

Suite reads the query parameter and automatically starts a scan.

Desktop uses a wide command-center grid. Diagnostic cards use a 12-column layout at large widths and collapse progressively for tablets and phones.

## Motion

Lenis 1.3.26 provides smooth scrolling. IntersectionObserver applies data-reveal transitions as content enters the viewport. Reduced-motion users receive the same content without motion.

## AI Overview

The floating AI control expands in place. It surfaces the highest-priority finding and its server-generated diagnosis rather than opening a separate empty sheet.
