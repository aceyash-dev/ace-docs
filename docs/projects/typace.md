---
title: "Typace"
description: "Technical documentation for Typace, a font distribution service and CDN for websites and applications."
---

# Typace

Typace is a font distribution service from The Ace Base.

It provides font files through the Typace CDN, allowing websites and applications to load fonts directly without bundling the font files into the project.

## Overview

Typace is designed to make font delivery simple:

```text
Your website
     │
     │ HTTPS
     ▼
Typace CDN
     │
     ▼
Font file
```

The CDN is available at:

```text
https://typace.ace-base.cc/
```

Individual assets follow this format:

```text
https://typace.ace-base.cc/{fontname}.{ext}
```

Replace:

- `{fontname}` with the actual font filename
- `{ext}` with the file extension

## Getting Started

### Prerequisites

You don't need to install Typace.

You only need:

- A website or application
- A font available through Typace
- Internet access for the browser to retrieve the font
- HTTPS in production

Typace can be used with:

- Plain HTML
- CSS
- JavaScript
- React
- Vue
- Svelte
- Astro
- Next.js
- Vite
- Other web frameworks

The integration is ultimately standard web font loading.

## CDN Usage

### Basic URL

Every Typace asset follows:

```text
https://typace.ace-base.cc/{fontname}.{ext}
```

For example, if a font is named `example.woff2`:

```text
https://typace.ace-base.cc/example.woff2
```

The filename must match the asset available on the CDN.

## Using Typace with CSS

The most flexible way to use Typace is with CSS `@font-face`.

```css
@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{fontname}.woff2")
       format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

Then use the font normally:

```css
body {
  font-family: "My Typace Font", sans-serif;
}
```

### Using Different Weights

If separate font files are available for different weights, define each weight separately.

```css
@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{fontname}-400.woff2")
       format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{fontname}-500.woff2")
       format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{fontname}-700.woff2")
       format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

Then:

```css
body {
  font-family: "My Typace Font", sans-serif;
  font-weight: 400;
}

strong {
  font-weight: 700;
}
```

> The exact filename pattern depends on how the font is published on Typace. Use the actual CDN filenames rather than assuming a weight suffix.

### Font Styles

For fonts that provide italic or other styles, declare the appropriate style:

```css
@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{fontname}-italic.woff2")
       format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
```

Then:

```css
em {
  font-family: "My Typace Font", sans-serif;
  font-style: italic;
}
```

## HTML Example

A complete minimal HTML page can use Typace like this:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >

  <title>Typace Example</title>

  <style>
    @font-face {
      font-family: "My Typace Font";
      src: url("https://typace.ace-base.cc/{fontname}.woff2")
           format("woff2");
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    body {
      font-family: "My Typace Font", sans-serif;
    }
  </style>
</head>

<body>
  <h1>Typace</h1>

  <p>
    This page uses a font delivered through the Typace CDN.
  </p>
</body>
</html>
```

Replace the example filename with the actual Typace font asset.

## Using Typace in a Framework

Typace doesn't require a framework-specific package.

The font is loaded through normal CSS.

### React

```css
@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{fontname}.woff2")
       format("woff2");
  font-display: swap;
}

:root {
  font-family: "My Typace Font", sans-serif;
}
```

### Vue

The same CSS approach can be used in a Vue application:

```css
@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{fontname}.woff2")
       format("woff2");
  font-display: swap;
}
```

### Next.js

Add the `@font-face` declaration to your global stylesheet:

```css
@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{fontname}.woff2")
       format("woff2");
  font-display: swap;
}
```

Then:

```css
body {
  font-family: "My Typace Font", sans-serif;
}
```

No Typace npm package is required for CDN usage.


## API Reference

Typace exposes a dynamic JSON API for discovering the current font catalog and generating integration data. The API reads the published font files from the Typace deployment rather than relying on a manually maintained font list.

### List fonts

```http
GET https://typace.ace-base.cc/api/fonts
```

Returns the current catalog. Each record can include:

- `name`: font name
- `file`: published filename
- `type`: file type
- `format`: browser/CSS format
- `url`: public font asset path
- `createdAt`: source/repository creation timestamp when available
- `updatedAt`: source/repository update timestamp when available
- `isNew`: optional new-font marker

The catalog currently supports:

- `.woff2`
- `.woff`
- `.otf`
- `.ttf`

Treat the API response as the source of truth. Do not hardcode a font inventory in applications or documentation.

### Search fonts

```http
GET https://typace.ace-base.cc/api/search?q=Spectral
```

The search endpoint accepts a `q` query parameter and searches the dynamic catalog.

### Get one font

```http
GET https://typace.ace-base.cc/api/fonts/Spectral
```

The font name or filename can be used to resolve a single catalog record.

### Generate CSS

```http
GET https://typace.ace-base.cc/api/css/Spectral
```

Returns a generated CSS `@font-face` declaration for the resolved font.

### OpenAPI

Machine-readable API documentation is available at:

```text
https://typace.ace-base.cc/api/openapi.json
```

### Machine-readable documentation

The Typace service also publishes an LLM-oriented documentation file:

```text
https://typace.ace-base.cc/llms.txt
```

Use it together with the API when answering questions about the live Typace catalog. The API is authoritative for currently available font records.

## Dynamic Font Pages

Each discovered font has a crawlable documentation/resource page:

```text
https://typace.ace-base.cc/fonts/{font-name}
```

These pages expose the font name, file, format, download URL, generated CSS endpoint, and machine-readable metadata.

For example:

```text
https://typace.ace-base.cc/fonts/Spectral
```

The font pages are generated from the same dynamic catalog used by the API, so new published fonts do not require a manual documentation edit.

## Choosing a Font Format

When multiple formats are available, prefer WOFF2 for modern web applications.

| Format | Extension | Typical use |
| --- | --- | --- |
| WOFF2 | `.woff2` | Modern web |
| WOFF | `.woff` | Older web compatibility |
| OpenType | `.otf` | Desktop/design workflows |
| TrueType | `.ttf` | Desktop/general use |

For normal websites:

```text
.woff2
```

should generally be your first choice when available.

## Performance

Font files can affect page loading performance.

Use only the weights and styles your application actually needs.

For example, if your site only uses regular and bold:

```css
@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{regular-font}.woff2")
       format("woff2");
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{bold-font}.woff2")
       format("woff2");
  font-weight: 700;
  font-display: swap;
}
```

Avoid loading every available weight simply because the files exist.

## font-display

For web fonts, `font-display: swap` is generally useful:

```css
@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{fontname}.woff2")
       format("woff2");
  font-display: swap;
}
```

This allows fallback text to remain visible while the font loads.

## Fallback Fonts

Always provide a fallback.

```css
body {
  font-family:
    "My Typace Font",
    system-ui,
    sans-serif;
}
```

If the Typace asset cannot be downloaded, the browser can still render readable text.

## Caching

Typace is delivered through the CDN infrastructure.

Browsers and intermediary caches may cache font assets according to the response headers provided by the CDN.

You should therefore reference stable production assets rather than repeatedly changing URLs unnecessarily.

## Vercel

Typace is powered by Vercel.

The public CDN hostname is:

```text
typace.ace-base.cc
```

Your application does not need to know how the underlying infrastructure works.

The relationship is:

```text
Application
     │
     │ requests font
     ▼
typace.ace-base.cc
     │
     ▼
Vercel infrastructure
     │
     ▼
Font asset
```

Your application simply consumes the public HTTPS URL.

## Security

Only load Typace assets over HTTPS:

```text
https://typace.ace-base.cc/{fontname}.{ext}
```

Do not replace the HTTPS URL with an insecure HTTP URL.

For production applications, make sure the rest of the application is also served over HTTPS.

## Troubleshooting

### The font isn't loading

Check the browser's developer tools and verify that the font request succeeds.

Check:

1. The hostname is correct.
2. The filename is correct.
3. The extension is correct.
4. The URL uses HTTPS.
5. The font file actually exists.
6. The browser isn't blocking the request.

Your URL should follow:

```text
https://typace.ace-base.cc/{fontname}.{ext}
```

### The browser uses the fallback font

If the request succeeds but the font isn't being applied, check the `font-family` name.

For example:

```css
@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{fontname}.woff2")
       format("woff2");
}
```

The same family name must then be used:

```css
body {
  font-family: "My Typace Font", sans-serif;
}
```

### The font weight looks wrong

Make sure the declared weight matches the font you're loading.

```css
@font-face {
  font-family: "My Typace Font";
  src: url("https://typace.ace-base.cc/{fontname}.woff2")
       format("woff2");
  font-weight: 700;
}
```

Then:

```css
.heading {
  font-family: "My Typace Font", sans-serif;
  font-weight: 700;
}
```

Don't declare a file as `700` if it is actually a regular font.

### The font works locally but not in production

Check:

- Production HTTPS
- CDN URL
- Browser Network requests
- CORS headers
- CSP configuration
- Actual production domain

Also make sure you aren't accidentally using a local development path.

## Developer Guide

Typace is intentionally consumed through the web.

A typical developer workflow is:

```text
Choose font
     ↓
Find CDN asset
     ↓
Add @font-face
     ↓
Choose weights/styles
     ↓
Add fallback
     ↓
Test locally
     ↓
Deploy
```

The application owns its typography configuration.

Typace provides the font asset.

## Recommended CSS Pattern

For a production site, keep the declaration explicit:

```css
@font-face {
  font-family: "Your Font";
  src:
    url("https://typace.ace-base.cc/{fontname}.woff2")
    format("woff2");

  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-sans: "Your Font", system-ui, sans-serif;
}

body {
  font-family: var(--font-sans);
}
```

This keeps the CDN implementation separate from the rest of your design system.

## Do I need to clone Typace?

No.

Typace is consumed as a CDN service.

You don't need to:

```bash
git clone ...
npm install ...
npm run build
```

to use a Typace font.

You only need the appropriate public CDN asset.

## Do I need an API key?

CDN font assets are consumed through their public URLs.

If a particular Typace service or asset requires additional authorization, follow the requirements specified for that asset.

Do not put private credentials into client-side code.

## Do I need an npm package?

No.

For CDN usage, standard CSS is enough:

```css
@font-face {
  font-family: "Your Font";
  src: url("https://typace.ace-base.cc/{fontname}.woff2")
       format("woff2");
}
```

## License

Font licensing depends on the specific typeface and its distribution terms.

Check the license associated with the font before:

- Redistributing the font
- Self-hosting it
- Packaging it with an application
- Modifying it
- Using it outside the permitted scope

Using a font through a CDN does not automatically change its underlying license.

## Frequently asked questions

### Do I need an npm package to use Typace?

No. Typace CDN assets can be consumed with standard CSS `@font-face` declarations and do not require a Typace npm package.

### Which font format should I use with Typace?

For normal modern web applications, WOFF2 is generally the preferred font format when the font is available in that format.

### How do I use a Typace font in CSS?

Use a CSS `@font-face` declaration whose `src` points to the appropriate HTTPS asset on `typace.ace-base.cc`, then reference the declared family in your stylesheet.
