---
title: "Ace ID"
description: "Detailed technical documentation for Ace ID, The Ace Base identity and authentication service."
---

# Ace ID

Ace ID is the identity and authentication service operated by **The Ace Base**. It provides hosted account authentication and an OpenID Connect identity provider for applications that need standards-based sign-in, identity claims, sessions, and delegated access.

**Production issuer**

`https://identity.ace-base.cc`

Ace ID is a hosted integration service. Applications normally integrate through OpenID Connect or the official JavaScript/TypeScript SDK. The private Ace ID service source does not need to be cloned or self-hosted for normal application integration.

## What Ace ID provides

- Account registration and password authentication
- OpenID Connect and OAuth 2.0 authorization
- Authorization Code flow with PKCE using S256
- Passkeys / WebAuthn
- TOTP multi-factor authentication and recovery codes
- Email verification and password recovery
- Session and device management
- Connected-application access management
- Account Logs for sign-ins, profile changes, account changes, and security activity
- RP-initiated logout and token revocation
- Browser security protections for state-changing mutations
- A first-run onboarding flow for new accounts

## Documentation map

| Topic | Reference |
| --- | --- |
| Provider, OIDC, scopes, clients, flows | [Ace ID](/projects/ace-id) |
| HTTP and account API | [API Reference](/projects/ace-id-api) |
| Security architecture and controls | [Security](/projects/ace-id-security) |
| JavaScript/TypeScript SDK | [SDK Guide](/projects/ace-id-sdk) |

## Quick integration

### 1. Use the production issuer

```text
https://identity.ace-base.cc
```

OIDC clients should use provider discovery instead of hard-coding authorization, token, JWKS, or logout endpoints:

```text
https://identity.ace-base.cc/.well-known/openid-configuration
```

### 2. Register an application

An Ace ID client registration contains:

- Client ID
- Application name
- Logo URI, when applicable
- Redirect URIs
- Grant types
- Response types
- Allowed scopes
- Application type
- Token endpoint authentication method
- Post-logout redirect URIs

Use an exact registered redirect URI. Do not use wildcard callback URLs.

### 3. Choose the client type

**Public clients**, including browser applications, should use:

```text
token_endpoint_auth_method = none
```

They should use Authorization Code + PKCE with S256 and must not contain a confidential secret in frontend code.

**Confidential clients** can use:

```text
token_endpoint_auth_method = client_secret_basic
```

Keep the client secret exclusively on the server.

## OpenID Connect

Ace ID implements OpenID Connect on top of OAuth 2.0.

### Supported scopes

The current provider supports:

- `openid`
- `profile`
- `email`
- `name`
- `username`
- `picture`
- `offline_access`

Unsupported scopes are filtered from the user-facing consent flow and are not granted.

| Scope | Purpose |
| --- | --- |
| `openid` | Enables OIDC and identifies the authenticated subject |
| `profile` | Profile identity information |
| `email` | Email address and verification state |
| `name` | Display name claim |
| `username` | Username / preferred username |
| `picture` | Avatar URL |
| `offline_access` | Requests refresh-token capable access where the client configuration and flow permit it |

### Identity claims

Applications should use `sub` as the stable external identity key.

Common claims include:

- `sub`
- `name`
- `preferred_username`
- `email`
- `email_verified`
- `picture`

Do not use an email address as the application's primary identity key. Email addresses can change; the OIDC subject is intended to represent the account identity.

## Authorization Code + PKCE

The recommended browser flow is:

```text
Application
    |
    | authorization request + state + nonce + code_challenge
    v
Ace ID
    |
    | user authentication
    | optional consent
    v
Authorization code
    |
    | redirect to registered callback
    v
Application
    |
    | code + code_verifier
    v
Token endpoint
    |
    v
Tokens / identity
```

PKCE uses the `S256` challenge method.

The application must validate the callback and exchange the authorization code according to the OIDC flow. A callback containing a `code` parameter is not, by itself, proof of authentication.

## Authentication

Ace ID hosts the user authentication experience.

Supported account authentication includes:

- Email and password
- Passkeys
- Multi-factor authentication with TOTP
- Recovery codes
- GitHub sign-in

MFA challenges are short-lived and attempt-limited. Recovery codes are treated as single-use credentials.

## Account security

Authenticated users can manage:

- Profile information
- Password
- Email verification
- Passkeys
- MFA
- Recovery codes
- Active devices and sessions
- Connected services
- Account activity logs
- Account deletion

Sensitive browser mutations are protected with same-origin checks in addition to authentication and endpoint-specific reauthentication where required.

## Account Logs

Account Logs are the user's security and account activity history.

The account page provides filters for:

- **All**
- **Logins**
- **Profile**
- **Account**
- **Security**

The service records relevant events such as:

- Successful sign-ins
- Profile changes
- Password changes
- Password resets
- Email verification
- MFA enable/disable
- Recovery-code regeneration
- Passkey addition/removal
- Connected-service revocation
- Device sign-out

A log record can include:

- Event category
- Event type
- Application/service name
- Browser
- Operating system
- Device type
- IP address
- Coarse location when supplied by the trusted deployment environment
- Event metadata
- Creation time

The account logs endpoint returns only records belonging to the authenticated user and limits the result to the newest 100 records. See the [API Reference](/projects/ace-id-api).

## Sessions and devices

Ace ID uses server-side sessions with HTTP-only cookies.

Production sessions use a `__Host-` prefixed cookie and Secure attributes. The normal session lifetime is 30 days, while security-sensitive operations can require recent authentication again.

Changing a password or completing other security actions can invalidate existing sessions. Users can review and sign out devices from the account security interface.

## Password recovery

Password reset tokens are generated randomly and stored only as hashes. Reset tokens expire and are atomically consumed so the same token cannot be used twice.

After a successful password reset, existing sessions and OIDC grants are invalidated.

The public password-reset request flow is designed not to disclose whether an email address belongs to an Ace ID account.

## Email verification

Users can request email verification from the account interface.

Verification tokens are consumed atomically and expire. Successful verification updates the account's email verification state and is recorded in Account Logs.

## Passkeys

Passkey registration is available from the authenticated account security interface.

The registration flow:

1. Requires recent authentication.
2. Creates a short-lived WebAuthn challenge.
3. Sends WebAuthn registration options to the browser.
4. Verifies the registration response.
5. Stores the credential public key and authenticator metadata.
6. Records the security event in Account Logs.

Passkey challenge cookies are HTTP-only and short-lived.

## MFA

Ace ID supports TOTP multi-factor authentication.

The MFA lifecycle includes:

1. Begin setup.
2. Display the TOTP secret / enrollment information.
3. Verify an authenticator code.
4. Persist encrypted TOTP material.
5. Generate recovery codes.
6. Allow recovery-code regeneration.
7. Allow MFA disablement after the required authentication checks.

Recovery codes are stored as hashes rather than plaintext.

MFA challenge consumption is transactionally protected. Invalid attempts are counted under a database lock, and successful TOTP or recovery-code consumption is committed atomically.

## Onboarding

New accounts receive a four-step first-run onboarding tour.

Completion is persisted through:

```text
aceid_users.onboarding_completed_at
```

The account API exposes the onboarding state, and completion invalidates the relevant server-side session cache. The UI does not reopen the tour after completion.

## Connected services

Users can review applications that have an active OIDC grant for their account.

A connected service can expose:

- Application name
- Application icon
- Connection time
- Client identifier

Revoking a service removes the associated OIDC grant records and is recorded in Account Logs.

## Logout

Ace ID supports normal account logout and OIDC RP-initiated logout.

The provider logout endpoint is:

```text
/session/end
```

Applications should use the provider's registered post-logout redirect configuration when returning users to an application after OIDC logout.

## Token revocation

OAuth token revocation is available through:

```http
POST /token/revocation
```

Use revocation when an application needs to explicitly invalidate a token through the OAuth interface.

## SDK

The official JavaScript/TypeScript package is:

```text
ace-id-sdk
```

Install it with:

```bash
npm install ace-id-sdk
```

The package provides ESM, CommonJS, TypeScript declarations, and a dedicated server export.

See the [SDK Guide](/projects/ace-id-sdk) for the current integration model.

## Direct OIDC integration

Applications that do not use the SDK can integrate directly with the standard OIDC interfaces:

1. Discover the issuer metadata.
2. Register the application.
3. Generate state, nonce, and PKCE values as appropriate.
4. Redirect the user to authorization.
5. Validate the callback.
6. Exchange the authorization code.
7. Validate the resulting identity.
8. Establish the application's own session.
9. Use UserInfo or ID-token claims according to the granted scopes.
10. Implement logout and token revocation where required.

The [API Reference](/projects/ace-id-api) documents the hosted HTTP surfaces. The provider discovery document remains the authoritative source for dynamic OIDC endpoint metadata.

## Production configuration

The Ace ID service itself uses environment configuration for:

```env
ISSUER=
DATABASE_URL=
SESSION_SECRET=
JWKS_JSON=
```

These values are service-side configuration and must never be exposed to browser applications.

Production uses HTTPS and secure cookies. The service is designed to run behind a trusted TLS-terminating proxy.

## Related resources

- [Ace ID provider](https://identity.ace-base.cc/)
- [OpenID Connect discovery](https://identity.ace-base.cc/.well-known/openid-configuration)
- [Ace ID API Reference](/projects/ace-id-api)
- [Ace ID Security](/projects/ace-id-security)
- [Ace ID SDK Guide](/projects/ace-id-sdk)
