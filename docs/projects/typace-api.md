# Typace API Reference

Typace exposes a dynamic, machine-readable API for discovering published fonts, searching the catalog, retrieving individual font metadata, and generating CSS `@font-face` declarations.

**Base URL:** `https://typace.ace-base.cc`

The API catalog is generated from the published `/fonts` directory. Do not hardcode a font inventory when the live catalog is available.

## Live endpoints

### List fonts

```http
GET https://typace.ace-base.cc/api/fonts
```

Returns the current published font catalog.

Each font record can include:

- `name`
- `file`
- `type`
- `format`
- `url`
- `createdAt`
- `updatedAt`
- `isNew`

Example:

```js
const response = await fetch('https://typace.ace-base.cc/api/fonts')
const fonts = await response.json()
```

### Search fonts

```http
GET https://typace.ace-base.cc/api/search?q=Spectral
```

Searches the current catalog by relevant font metadata such as name, filename, type, and format.

```js
const response = await fetch(
  'https://typace.ace-base.cc/api/search?q=Spectral'
)
const results = await response.json()
```

### Get one font

```http
GET https://typace.ace-base.cc/api/fonts/Spectral
```

Returns metadata for the requested font.

Use the exact font name returned by the live catalog. The route is designed to support URL-safe encoded font names.

### Generate CSS

```http
GET https://typace.ace-base.cc/api/css/Spectral
```

Returns a generated CSS `@font-face` declaration for the requested font.

This is useful when an integration needs the correct asset URL and format without maintaining a separate CSS declaration manually.

### OpenAPI

The machine-readable API specification is available at:

```
https://typace.ace-base.cc/api/openapi.json
```

### LLM documentation

Machine-readable service guidance is available at:

```
https://typace.ace-base.cc/llms.txt
```

For current font availability, prefer the live catalog and API responses over examples in documentation.

## Dynamic font pages

Each published font can also have a crawlable page:

```
https://typace.ace-base.cc/fonts/{font-name}
```

Example:

```
https://typace.ace-base.cc/fonts/Spectral
```

These pages expose indexable metadata, a download link, and the generated CSS endpoint while keeping the existing Typace frontend unchanged.

## Supported formats

Typace currently discovers these font file formats:

- WOFF2
- WOFF
- OTF
- TTF

The API reports the detected file type and format for each catalog entry.

## CSS integration

A normal CSS integration can use the generated font asset directly:

```css
@font-face {
  font-family: 'Spectral';
  src: url('https://typace.ace-base.cc/fonts/Spectral.ttf') format('truetype');
  font-display: swap;
}

body {
  font-family: 'Spectral', serif;
}
```

For production web delivery, use the format provided by the live catalog rather than assuming a file extension.

## Caching and delivery

Typace serves font assets over HTTPS. API responses and static font assets are configured separately so metadata can remain dynamic while published font files retain efficient delivery behavior.

Do not copy API metadata into application source unless you specifically need a snapshot. Query the API when current catalog state matters.

## Source of truth

The following hierarchy should be used when integrating Typace:

1. **Live API:** current catalog and generated metadata.
2. **OpenAPI:** machine-readable endpoint contract.
3. **LLM documentation:** concise service guidance and retrieval rules.
4. **Human documentation:** conceptual explanations and integration examples.

Documentation examples are illustrative. They must not be treated as proof that a particular font is currently published.

## Licensing

Typace provides font delivery infrastructure. Font licensing remains specific to each typeface and its author or distributor. Verify the applicable license before redistributing a font or embedding it in a product.

## Related documentation

- [Typace project guide](/projects/typace)
- [Typace LLM documentation](https://typace.ace-base.cc/llms.txt)
- [Typace OpenAPI](https://typace.ace-base.cc/api/openapi.json)
- [Live font catalog](https://typace.ace-base.cc/api/fonts)
- [The Ace Base documentation](/)
