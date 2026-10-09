---
title: "Typace API Reference"
description: "Reference for Typace font catalog, search, individual font metadata, CSS generation, and current commit metadata endpoints."
---

# Typace API Reference

Typace provides a public API for discovering published font assets, searching the catalog, retrieving a single font record, generating CSS, and inspecting the deployed source revision.

**Base URL:** `https://typace.ace-base.cc`

The catalog is derived from the font assets published by the deployment. Use the live response as the source of truth; do not hardcode an inventory or assume every family has every format.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/fonts` | List the current catalog |
| `GET` | `/api/search?q={query}` | Search the catalog |
| `GET` | `/api/fonts/{slug}` | Retrieve one font record |
| `GET` | `/api/css/{slug}` | Generate a CSS `@font-face` rule |
| `GET` | `/api/commit` | Read current source revision metadata |
| `GET` | `/api/openapi.json` | Read the OpenAPI contract |

The API also responds to `OPTIONS` for cross-origin preflight requests. Other methods return `405 Method Not Allowed`.

## List fonts

```http
GET https://typace.ace-base.cc/api/fonts
```

Returns a JSON array of published font records.

### Font record

| Field | Type | Meaning |
| --- | --- | --- |
| `name` | string | Display name derived from the asset filename |
| `file` | string | Repository-relative asset path |
| `type` | string | File extension: `ttf`, `otf`, `woff`, or `woff2` |
| `format` | string | CSS format label: `truetype`, `opentype`, `woff`, or `woff2` |
| `category` | string | `serif`, `sans-serif`, or `unknown` |
| `url` | string | Relative URL for the published asset |
| `createdAt` | string or null | Source creation time, when reliable metadata is available |
| `updatedAt` | string or null | Source update time, when reliable metadata is available |

Categories are derived from supported embedded font metadata. Typace does not guess a category from a filename. `unknown` means the asset did not provide enough reliable metadata. Dates are `null` when the source cannot establish them reliably.

### Example

```js
const response = await fetch("https://typace.ace-base.cc/api/fonts");

if (!response.ok) {
  throw new Error(`Typace returned HTTP ${response.status}`);
}

const fonts = await response.json();
console.log(fonts);
```

## Search fonts

```http
GET https://typace.ace-base.cc/api/search?q=Spectral
```

The `q` parameter is optional and limited to 200 characters. Search matches normalized terms against the font name, file path, type, and format. When `q` is omitted or empty, the endpoint returns the current catalog.

```js
const query = new URLSearchParams({ q: "Spectral" });
const response = await fetch(
  `https://typace.ace-base.cc/api/search?${query}`
);

if (!response.ok) {
  throw new Error(`Typace search failed: ${response.status}`);
}

const matches = await response.json();
```

## Get one font

```http
GET https://typace.ace-base.cc/api/fonts/{slug}
```

The slug can be a normalized font name or filename. Encode spaces and other reserved characters when constructing the URL. Malformed percent-encoding is rejected as a not-found result rather than causing an unhandled error.

Example:

```js
const slug = encodeURIComponent("Spectral");
const response = await fetch(
  `https://typace.ace-base.cc/api/fonts/${slug}`
);

if (response.status === 404) {
  throw new Error("Font not found in the current catalog");
}
if (!response.ok) {
  throw new Error(`Typace returned HTTP ${response.status}`);
}

const font = await response.json();
```

## Generate CSS

```http
GET https://typace.ace-base.cc/api/css/{slug}
```

Returns a CSS `@font-face` declaration with the resolved asset URL and its actual format. The generated declaration uses `font-display: swap`; applications should still define appropriate weight, style, and fallback families based on the actual font file.

```js
const response = await fetch(
  "https://typace.ace-base.cc/api/css/Spectral"
);

if (!response.ok) {
  throw new Error(`Could not generate font CSS: ${response.status}`);
}

const css = await response.text();
```

Do not assume that an example family or filename exists. Resolve it through the live catalog first.

## Current commit metadata

```http
GET https://typace.ace-base.cc/api/commit
```

Returns metadata for the current Vercel deployment commit when deployment Git metadata is available. If deployment metadata is absent, the API attempts to resolve the latest commit on the repository's `main` branch.

Example response:

```json
{
  "sha": "0123456789abcdef0123456789abcdef01234567",
  "shortSha": "0123456",
  "message": "Improve font catalog metadata",
  "date": "2026-10-09T12:00:00Z",
  "url": "https://github.com/aceyash-dev/Typace/commit/0123456789abcdef0123456789abcdef01234567",
  "source": "deployment"
}
```

The SHA and message identify the revision. `date` is an ISO 8601 timestamp or `null` if a reliable timestamp cannot be resolved. `source` is `deployment` or `github`. A client can calculate relative time from `date`, while keeping the absolute timestamp available as a tooltip or accessible label.

Because the Typace repository is private, the deployment may need a server-side `GITHUB_TOKEN` or `GITHUB_PAT` with read-only repository access to retrieve commit dates. Never expose that token to browser code. The endpoint caches successful results briefly and does not return credentials.

## OpenAPI

The machine-readable contract is available at:

```text
https://typace.ace-base.cc/api/openapi.json
```

Use this document for client generation and schema-aware integrations. If this human reference and the live OpenAPI contract ever differ, check the currently deployed version before relying on either.

## CORS, caching, and errors

- Public read endpoints allow cross-origin requests.
- Successful catalog/search and commit responses use short public cache lifetimes with stale-while-revalidate behavior.
- Unsupported methods return `405` and an `Allow` header.
- Font lookup returns `404` when the requested font is not in the current catalog.
- Unexpected catalog/search errors return JSON with a stable `code` field.
- Commit metadata failures return `502` with a machine-readable error code.
- Do not assume the API provides authentication, rate-limit guarantees, or a permanent availability SLA unless those are explicitly published by the service.

## Licensing

Typace is font delivery infrastructure; it does not make every font's licensing terms identical. Verify the license attached to each typeface before embedding, redistributing, modifying, or bundling it in an application.

## Related resources

- [Typace project guide](/projects/typace)
- [Live font catalog](https://typace.ace-base.cc/api/fonts)
- [Live search API](https://typace.ace-base.cc/api/search?q=Spectral)
- [Current commit metadata](https://typace.ace-base.cc/api/commit)
- [OpenAPI specification](https://typace.ace-base.cc/api/openapi.json)
- [LLM-oriented documentation](https://typace.ace-base.cc/llms.txt)
- [Typace source repository](https://github.com/aceyash-dev/Typace)
