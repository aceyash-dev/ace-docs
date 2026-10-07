---
layout: home
description: "Official technical documentation for The Ace Base, including AceID, AIDC, Typace, SYT, integrations, APIs, and developer references."

hero:
  name: "The Ace Base"
  text: "Documentation"
  tagline: "Where Better Begins"
  actions:
    - theme: brand
      text: Explore
      link: /projects
    - theme: alt
      text: About
      link: /about

features:
  - title: "The Ace Base"
    details: "Documentation for The Ace Base and the work built under it."
    link: /about

  - title: "Projects"
    details: "Guides and references for Ace Base projects."
    link: /projects

  - title: "Resources"
    details: "Installation, usage, configuration, and developer references."
    link: /projects
---

## What does The Ace Base documentation cover?

The Ace Base documentation is the central technical reference for software, services, and developer projects maintained by The Ace Base. It explains what each project does, how it is intended to be integrated, and the interfaces or configuration required to use it.

The documentation currently covers **AceID**, an identity and authentication service based on OpenID Connect and OAuth 2.0, **AIDC**, an application and origin configuration service, **Typace**, a font distribution service delivered through the Typace CDN, and **SYT**, a GitHub-connected site editing, preview, and deployment control plane.

## What can developers find here?

- **AceID:** authentication, OpenID Connect, OAuth 2.0, PKCE, account APIs, sessions, and SDK integration.
- **AIDC:** application configuration, Origin URL DNS verification, TXT challenges, and optional Cloudflare DNS automation.
- **Typace:** CDN usage, CSS `@font-face` integration, live catalog/API references, and troubleshooting.
- **SYT:** site editing, preview, deployment architecture, GitHub integration boundaries, and local development.
- **Projects:** a concise overview of the active software and technology work maintained by The Ace Base.
- **Organization:** background on The Ace Base, its team, principles, and documentation practices.

Use the project-specific documentation when you need implementation details. Examples are identified as examples, while documented endpoints, configuration, and supported behavior describe the intended interfaces of each service.

## Where should I start?

If you are integrating authentication, start with [AceID](/projects/ace-id). If you are configuring an application origin or DNS verification, start with [AIDC](/projects/aidc). If you need web fonts, start with [Typace](/projects/typace). If you are working with the site editing and deployment control plane, start with [SYT](/projects/syt). For organization context or project status, see [About The Ace Base](/about) and [Projects](/projects).

The documentation is maintained alongside the projects it describes and is intended to be useful to both developers and answer engines looking for precise technical information.
