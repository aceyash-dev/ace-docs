---
title: "Ace ID SDK Guide"
description: "JavaScript, TypeScript, Swift and Android integration guide for the Ace ID SDK."
---

# Ace ID SDK Guide

The official JavaScript/TypeScript package is:

```text
ace-id-sdk
```

Install:

```bash
npm install ace-id-sdk
```

The planned `0.2.3` release line includes JavaScript/TypeScript, an iOS Swift Package, and a native Android library. Version `0.2.3` is a release candidate until tagged builds pass and the release is published.

The current JavaScript package provides:

- ESM
- CommonJS
- TypeScript declarations
- Browser/Vanilla build support
- A dedicated `./server` export

The package targets Node.js 18 or newer for its package tooling.

## Provider configuration

Production issuer:

```text
https://identity.ace-base.cc
```

Configure the client with the issuer and the exact registered redirect URI.

Do not put a confidential client secret in browser code.

## Authorization Code + PKCE

The SDK uses Authorization Code + PKCE with S256.

The browser authentication sequence is:

```text
signIn()
   |
   | state + nonce + code_verifier
   | S256 code_challenge
   v
Ace ID
   |
   | login + MFA + consent as required
   v
callback URL
   |
   | handleCallback()
   v
authenticated session
```

The SDK generates the authorization transaction values and stores the browser transaction state using its configured storage.

## Transaction validation

The callback handler validates the transaction before exchanging the authorization code.

It checks:

- OAuth error responses
- Required code and state values
- Stored transaction presence
- Transaction expiration
- State equality
- PKCE verifier
- ID-token signature and claims when an ID token is returned

Applications should always use the SDK callback handler rather than implementing a second callback validation path.

## Basic integration

The exact constructor and options are versioned. Use the TypeScript declarations from the installed package for the current signature.

The browser client is `AID`:

```ts
import { AID } from "ace-id-sdk";

const aid = new AID({
  issuer: "https://identity.ace-base.cc",
  clientId: "my-public-client",
  redirectUri: "https://example.com/callback"
});
```

Start authentication:

```ts
await aid.signIn();
```

Handle the callback:

```ts
const session = await aid.handleCallback();
console.log(session.user);
```

The current browser client exposes:

- `signIn()`
- `handleCallback()`
- `getSession()`
- `isAuthenticated()`
- `getUser()`
- `getAccessToken()`
- `getValidAccessToken()`
- `signOut()`

The installed package's exported TypeScript declarations remain authoritative for exact overloads and option types.

## AIDC project configuration

AIDC projects can store their Ace ID integration configuration in a `.aid.json` file. AIDC owns this project configuration; the SDK consumes the configuration supplied by the application.

Example:

```json
{
  "issuer": "https://identity.ace-base.cc",
  "app_id": "your-app-id",
  "client_id": "your-client-id",
  "redirect_uri": "https://example.com/callback",
  "scopes": ["openid", "profile", "email", "offline_access"],
  "project_type": "web",
  "framework": "Vite",
  "sdk": "ace-id-sdk"
}
```

The SDK exposes `AIDProjectConfig` and `createAIDFromProjectConfig()`:

```ts
import {
  createAIDFromProjectConfig,
} from "ace-id-sdk";

const aid = createAIDFromProjectConfig(projectConfig);
```

The adapter maps the AIDC fields to the browser client's configuration:

| AIDC field | SDK field |
| --- | --- |
| `issuer` | `issuer` |
| `client_id` | `clientId` |
| `redirect_uri` | `redirectUri` |
| `scopes` | `scope` (space-separated) |

`app_id`, `project_type`, `framework`, and `sdk` remain AIDC project metadata and are not passed to the `AID` constructor.

The SDK does not read `.aid.json` from the filesystem and does not load `.env` files. Project setup, configuration files, and environment synchronization belong to AIDC tooling.

For Node.js or tests, inject an explicit storage implementation:

```ts
import { AID, MemoryStorage } from "ace-id-sdk";

const aid = new AID({
  issuer: "https://identity.ace-base.cc",
  clientId: "test-client",
  redirectUri: "http://localhost:3000/callback",
  storage: new MemoryStorage(),
});
```

Browser applications use `SessionStorage` by default.

## Sessions

The SDK exposes session helpers for the authenticated application integration.

Typical operations include:

```js
client.getSession();
client.isAuthenticated();
client.getAccessToken();
client.getValidAccessToken();
```

Use `getValidAccessToken()` when the application needs an access token that may need refreshing.

## Token refresh

The SDK can refresh an expired access token when the session contains a refresh token and the provider/client configuration supports refresh tokens.

The refresh flow:

1. Reads the current session.
2. Checks for a refresh token.
3. Checks provider support for refresh-token grants.
4. Exchanges the refresh token at the token endpoint.
5. Validates a returned ID token when present.
6. Persists the updated session.

Concurrent refresh requests share the same in-flight refresh operation to avoid duplicate token exchanges.

## Storage

The SDK can use a configurable storage implementation. Browser integrations should use a storage mechanism appropriate for the application's security model.

Do not place long-lived confidential credentials in browser storage.

## Server integration

The package exposes a dedicated server entry point:

```text
ace-id-sdk/server
```

Use the server export for server-side integration patterns supported by the installed package. Keep confidential credentials and server-side session material out of browser bundles.

## Vanilla JavaScript

The package also provides a browser bundle for applications that do not use npm or a bundler.

The bundle exposes the SDK through the global `AceID` object and includes the browser client and storage/helpers.

Do not use a browser bundle for server-side credentials.

## Android

The repository also contains a native Kotlin Android SDK under `android/`.

Current SDK properties:

- Namespace: `tab.aid.sdk`
- Minimum Android version: API 23
- Compile SDK: API 36
- Authentication: Authorization Code + PKCE (S256)
- Distribution: Android Archive (AAR)

The Android SDK is native Android code. It is not a WebView wrapper.

For a `0.2.3` AAR integration, use `ace-id-sdk-android-0.2.3.aar` from the GitHub Release once published. Verify the SHA-256 listed on the release page before vendoring the binary. Do not use an Actions artifact as a substitute for a tagged release.

The Android workflow uses Authorization Code + PKCE with S256. Keep application secrets out of the Android client because Android applications are public clients.

::: warning Android releases
Use published Android SDK releases for application builds. Release `0.2.3` must not be treated as published until its GitHub Release and AAR asset are present. CI artifacts are development outputs and should not be treated as stable releases.
:::

## Server

The package provides a server-specific export:

```ts
import { AIDServer } from "ace-id-sdk/server";

const aid = new AIDServer({
  issuer: "https://identity.ace-base.cc",
  clientId: process.env.ACE_ID_CLIENT_ID!,
  clientSecret: process.env.ACE_ID_CLIENT_SECRET!
});

const tokens = await aid.exchangeCode(code, redirectUri);
const user = await aid.userInfo(tokens.accessToken);
```

Never import `ace-id-sdk/server` into browser code.

## Direct OIDC fallback

The SDK is not mandatory. A standards-compliant application can integrate directly with Ace ID using:

```text
https://identity.ace-base.cc/.well-known/openid-configuration
```

Prefer provider discovery so authorization, token, JWKS, UserInfo, revocation, and logout endpoints remain configuration-driven.

## Browser security rules

For browser applications:

- Use a public-client registration.
- Use PKCE S256.
- Never embed a confidential client secret.
- Register exact redirect URIs.
- Validate the callback through the SDK.
- Use `sub` as the stable identity key.
- Keep application authorization separate from authentication.
- Use HTTPS in production.

## Troubleshooting

### Callback rejected

Check:

- The callback URL exactly matches the registered redirect URI.
- The same issuer is used during authorization and callback handling.
- The transaction has not expired.
- The browser has retained the SDK transaction state.

### Token refresh fails

Check:

- The client is configured to receive refresh tokens where appropriate.
- `offline_access` is included when the application's provider configuration requires it.
- The refresh token has not been revoked or expired.
- The provider discovery metadata advertises refresh-token support.

### User appears signed out

Check:

- The application's storage implementation.
- Session expiration.
- Whether a password/security change invalidated the session.
- Whether the browser cleared the configured storage.



## Native package guides

- [Android SDK 0.2.3 guide](/projects/ace-id-sdk-android)
- [iOS Swift Package 0.2.3 guide](/projects/ace-id-sdk-ios)
- [Framework and SSR integration](/projects/ace-id-sdk-framework-adapters)

The Swift Package is defined by `Package.swift`, with product `AceID` and minimum deployment target iOS 15. Swift Package Manager resolves AppAuth-iOS as a dependency. The package source is versioned with the same `0.2.3` source tag as the Android AAR release. After the release PR is merged, the unified **SDK Release Build** workflow can publish the artifacts once the npm package, Android tests/AAR, and iOS Simulator tests all pass.
