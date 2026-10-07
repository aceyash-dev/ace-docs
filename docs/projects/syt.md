---
title: "SYT"
description: "Technical documentation for SYT, The Ace Base site editing, preview, and deployment control plane."
---

# SYT

SYT is The Ace Base's GitHub-connected **site editing, preview, and deployment platform**.

**Production control plane**

`https://syt.ace-base.cc`

The current repository describes SYT as a developer-console-oriented control plane for managing site projects and deployments. User-site source and deployment artifacts remain isolated from the SYT control-plane deployment.

## Architecture

The documented architecture is:

```text
GitHub
  ↓
SYT GitHub App
  ↓
SYT API
  ↓
Editor / Preview / Deploy
  ↓
CDN / Edge
```

GitHub remains the source of truth for repository content.

## Current implementation

The current SYT repository uses:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Hugeicons
- Motion
- JOSE
- Vercel

The production project is deployed from `aceyash-dev/syt`, with pushes to `main` triggering the SYT control-plane deployment.

## Integration boundaries

The repository documents these boundaries:

- **Ace ID** handles user authentication.
- The **GitHub App** handles repository installation and scoped repository access.
- Webhooks are verified and processed idempotently.
- Preview execution is intended to run in an isolated sandbox.
- Publishing operates on a selected commit and creates an independent static artifact.
- User-site deployments remain isolated from the SYT control plane.

The preview, publishing, and webhook boundaries above are documented architectural boundaries. This page does not claim a public API contract where the repository does not expose one.

## Local development

Clone the repository and install its dependencies:

```bash
npm install
npm run dev
```

The development server is configured to run at:

```text
http://localhost:3000
```

## Production model

SYT is the control plane, not the user's deployed site.

Conceptually:

```text
SYT control plane
      │
      ├── edit
      ├── preview
      └── publish
              │
              ▼
      independent site artifact
```

Changing a user site must not redeploy the SYT control plane.

## Source of truth

For implementation details, use the [SYT GitHub repository](https://github.com/aceyash-dev/syt). This documentation intentionally avoids inventing endpoint names, request formats, deployment APIs, or feature behavior that is not established by the source repository.

