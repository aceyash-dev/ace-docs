---
title: "Typace"
description: "Developer guide for Typace, a font discovery library and web font delivery service with a live catalog API."
---

# Typace

Typace is a font library and font delivery service from The Ace Base. It helps developers discover published font assets and load them over HTTPS without copying the font files into their own application.

**Website:** [typace.ace-base.cc](https://typace.ace-base.cc/)  
**Live catalog:** [`GET /api/fonts`](https://typace.ace-base.cc/api/fonts)  
**API reference:** [Typace API](/projects/typace-api)  
**OpenAPI:** [`/api/openapi.json`](https://typace.ace-base.cc/api/openapi.json)

## How it works

1. Query the live catalog to find a published font.
2. Use the asset `url` and `format` returned by the catalog.
3. Define the font in CSS with `@font-face`.
4. Choose only the weights and styles your application uses.
5. Keep a system fallback so text remains readable if the asset cannot load.

The catalog is dynamic. A filename shown in an example is illustrative unless it appears in the current API response.

## Find an available font

```js
const response = await fetch("https://typace.ace-base.cc/api/fonts");

if (!response.ok) {
  throw new Error(`Typace catalog request failed: ${response.status}`);
}

const fonts = await response.json();
console.table(fonts.map(({ name, type, format, category, url }) => ({
  name, type, format, category, url
})));
```

To search, use `GET https://typace.ace-base.cc/api/search?q=QUERY`. Search uses normalized token-prefix matching to avoid arbitrary substring false positives. See the [API reference](/projects/typace-api) for endpoint parameters, error responses, and the current commit endpoint.

## Use a font in CSS

Use the exact asset path and format reported by the API. For example, after selecting a record:

```js
const font = fonts[0];

const style = document.createElement("style");
style.textContent = `
  @font-face {
    font-family: ${JSON.stringify(font.name)};
    src: url(${JSON.stringify(new URL(font.url, "https://typace.ace-base.cc").href)})
      format(${JSON.stringify(font.format)});
    font-display: swap;
  }
`;

document.head.append(style);
```

For a fixed production stylesheet, copy the verified asset URL and format from the catalog response:

```css
@font-face {
  font-family: "Your Font";
  src: url("https://typace.ace-base.cc/fonts/REPLACE-WITH-ACTUAL-FILE.woff2")
    format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Your Font", system-ui, sans-serif;
}
```

Replace the example URL and format with a real catalog record. Do not assume every family has WOFF2, a regular weight, an italic style, or a complete set of weights.

## Generate CSS through the API

The CSS endpoint resolves a catalog entry and returns a generated `@font-face` rule:

```js
const response = await fetch(
  "https://typace.ace-base.cc/api/css/" + encodeURIComponent(font.name)
);

if (!response.ok) {
  throw new Error(`Typace CSS request failed: ${response.status}`);
}

const css = await response.text();
```

This can be useful for tooling, previews, or applications that generate styles dynamically. For ordinary websites, a static CSS declaration is often simpler.

## Frameworks

Typace uses standard web font loading, so no framework-specific package is required.

- **React / Vue / Svelte:** put the verified `@font-face` declaration in the application's stylesheet.
- **Next.js / Nuxt / Astro / Vite:** use the same CSS integration and verify the final asset URL after deployment.
- **Design tools:** use a compatible downloadable asset only when its license permits that use.

If your framework provides a first-party font optimization system, compare its self-hosting behavior with CDN loading before choosing an integration.

## Metadata accuracy

Catalog records expose the asset's name, path, file type, CSS format, category, URL, and source dates where reliable data is available.

- Categories are read from supported embedded font metadata. They are not guessed from filenames.
- `unknown` means there is not enough reliable metadata to classify the font.
- In the current implementation, `createdAt` and `updatedAt` are `null`; reliable per-asset timestamps are not wired into the catalog yet. Do not use these fields for newest-first sorting until this changes.
- Typace does not infer licensing, foundry, designer, variable axes, weight, style, or glyph coverage unless those details are explicitly provided by a reliable source.

Treat the API response as authoritative for published assets, but check the applicable license separately before redistribution or commercial use.

## Performance and caching

- Prefer WOFF2 when the live catalog offers it and it meets your browser support requirements.
- Load only the weights and styles the interface actually uses.
- Use `font-display: swap` for a readable fallback during font loading.
- Include a system fallback in every font stack.
- Avoid requesting the same font file through multiple URLs.
- Let the service's response headers govern cache behavior; don't assume an asset is immutable unless its URL/versioning guarantees that.

## Troubleshooting

### The font is not loading

1. Confirm the asset appears in [the live catalog](https://typace.ace-base.cc/api/fonts).
2. Copy the exact `url` value from its record.
3. Check the browser Network panel for HTTP status and CORS errors.
4. Verify the URL uses HTTPS and the format label matches the file.
5. Confirm your Content Security Policy permits the Typace origin under `font-src`.

### The wrong weight or style appears

Declare only weights and styles that the actual font file supports. Separate files usually need separate `@font-face` declarations; do not label a regular font as bold just because the CSS requests `font-weight: 700`.

### A font is missing from the catalog

The catalog reflects assets in the current deployment. A repository change or pull request does not guarantee that an asset is present in production until the relevant deployment has completed.

## Licensing

Each font can have different license terms. Check the applicable license before embedding, modifying, redistributing, self-hosting, or bundling an asset. Access through a CDN does not change the font's underlying license.

## Related resources

- [Typace API reference](/projects/typace-api)
- [Live catalog](https://typace.ace-base.cc/api/fonts)
- [Search API](https://typace.ace-base.cc/api/search)
- [Commit metadata](https://typace.ace-base.cc/api/commit)
- [OpenAPI specification](https://typace.ace-base.cc/api/openapi.json)
- [LLM documentation](https://typace.ace-base.cc/llms.txt)
- [Typace repository](https://github.com/aceyash-dev/Typace)
