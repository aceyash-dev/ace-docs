---
title: "Projects"
description: "Software, tools, and technology projects built and maintained by The Ace Base, including AceID, AIDC, Typace, and SYT."
---

# Projects

Software, tools, and technology projects built and maintained by The Ace Base.

## AceID

### Identity infrastructure

AceID is an identity and authentication project within the The Ace Base ecosystem.

It provides hosted identity infrastructure for account management and authentication, with OpenID Connect, OAuth 2.0, Authorization Code + PKCE, passkeys, TOTP MFA, sessions, account activity logs, connected-service control, and application authorization.

**Status:** Active

[Read the AceID documentation →](/projects/ace-id)

[API Reference →](/projects/ace-id-api)

[Security →](/projects/ace-id-security)

[SDK Guide →](/projects/ace-id-sdk)

[Framework and SSR integration →](/projects/ace-id-sdk-framework-adapters)

---

## AIDC

### Application and origin configuration

AIDC provides application configuration and Origin URL verification for The Ace Base ecosystem.

It exposes DNS-based TXT verification for origins, with optional automatic TXT record creation for domains managed by Cloudflare.

**Status:** Active

[Read the AIDC documentation →](/projects/aidc)

---

## Typace

### Typography

Typace is a typography-focused project from The Ace Base.

It provides a web-based interface for discovering and previewing fonts, along with CDN-based font delivery for using font assets in websites and applications.

### Typace CDN

Font files are served through the Typace CDN using the following URL structure:

```text
https://typace.ace-base.cc/{fontname}.{ext}
```

---

## SYT

### Site editing and deployment control plane

SYT is a GitHub-connected site editing, preview, and deployment platform. It acts as the control plane while keeping user-site deployments isolated from the SYT deployment.

**Production:** `https://syt.ace-base.cc`

**Status:** Active

