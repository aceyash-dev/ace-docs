---
title: "Ace ID SDK Guide"
description: "JavaScript and TypeScript integration guide for the Ace ID SDK."
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

The current package provides:

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

Conceptually:

```js
const client = createAceIdClient({
  issuer: "https://identity.ace-base.cc",
  clientId: "your-client-id",
  redirectUri: "https://example.com/auth/callback"
});
```

Start authentication:

```js
await client.signIn();
```

Handle the callback:

```js
await client.handleCallback();
```

The installed package's exported types are authoritative for exact method signatures.

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

