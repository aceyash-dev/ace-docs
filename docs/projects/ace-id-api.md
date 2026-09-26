---
title: "Ace ID API Reference"
description: "HTTP and OIDC API reference for Ace ID."
---

# Ace ID API Reference

This page documents the application-facing HTTP surfaces of Ace ID. For dynamic OpenID Connect endpoint metadata, use the production discovery document:

`https://identity.ace-base.cc/.well-known/openid-configuration`

## Authentication model

Browser account routes use the Ace ID session cookie. Protected API calls must be made from an authenticated browser session.

OIDC client APIs use the OAuth credentials and tokens defined by the provider metadata and client registration.

## Account API

### Get account

```http
GET /api/account
```

Returns the current authenticated account.

Unauthenticated:

```json
{"error":"not_authenticated"}
```

HTTP status: `401`.

The account response includes the current onboarding state.

### Update account

```http
POST /api/account
Content-Type: application/json
```

Supported account fields include:

- `email`
- `username`
- `displayName`
- `avatarUrl`

The endpoint is protected against cross-origin browser mutation.

### Delete account

```http
DELETE /api/account
```

Requires authentication. A successful deletion removes the account and clears the current session.

## Account Logs

### List logs

```http
GET /api/account/logs
```

Optional filter:

```text
/api/account/logs?category=login
/api/account/logs?category=profile
/api/account/logs?category=account
/api/account/logs?category=security
```

Valid categories:

- `login`
- `profile`
- `account`
- `security`

Omit the category for all categories.

Response shape:

```json
{
  "log": [
    {
      "id": "123",
      "category": "login",
      "event_type": "login_success",
      "name": "Ace ID",
      "icon": "/icon.png",
      "ip_address": "203.0.113.10",
      "browser": "Chrome",
      "os": "Android",
      "device_type": "Mobile",
      "location": "IN",
      "metadata": {},
      "created_at": "2026-09-26T00:00:00.000Z"
    }
  ]
}
```

The endpoint:

- Requires the authenticated Ace ID user.
- Returns only that user's records.
- Sorts newest first.
- Returns at most 100 records.
- Does not accept an arbitrary `user_id`.

## Onboarding

### Complete onboarding

```http
POST /api/account/onboarding/complete
```

Requires an authenticated session and same-origin browser request.

The operation is idempotent. It sets `onboarding_completed_at` only when it has not already been set.

Response:

```json
{"completed":true}
```

The service invalidates the current session-cache entry after the database update.

## Email verification

### Send verification email

```http
POST /api/email-verification/send
```

Requires authentication.

Possible responses include:

- `{"status":"sent"}`
- `{"status":"already_verified"}`
- rate limiting
- delivery failure

The verification link is consumed at:

```http
GET /verify-email?token=...
```

## Passkeys

### Registration options

```http
POST /api/account/passkeys/options
```

Requires recent authentication.

The response contains the WebAuthn registration challenge, relying-party ID, origin, and user information required by the browser WebAuthn API.

### Register a passkey

```http
POST /api/account/passkeys
Content-Type: application/json
```

Requires the short-lived passkey challenge cookie and recent authentication.

### List passkeys

```http
GET /api/account/passkeys
```

Returns the authenticated user's registered passkeys.

### Remove a passkey

```http
DELETE /api/account/passkeys/:id
```

Requires recent authentication and same-origin browser protection.

## MFA

### Get MFA status

```http
GET /api/account/mfa
```

Returns the current account MFA state.

### Start TOTP setup

```http
POST /api/account/mfa/setup
```

Starts TOTP enrollment.

### Verify TOTP setup

```http
POST /api/account/mfa/setup/verify
```

Confirms the authenticator code and completes enrollment.

### Regenerate recovery codes

```http
POST /api/account/mfa/recovery/regenerate
```

Regenerates recovery codes and invalidates the previous set.

### Disable MFA

```http
POST /api/account/mfa/disable
```

Disables MFA after the endpoint's authentication checks succeed.

### MFA login

```http
POST /login/mfa
```

Completes an MFA-protected sign-in using a TOTP or recovery code.

## Devices and sessions

### List devices

```http
POST /api/account/devices
Content-Type: application/json
```

Requires recent authentication and the current account password.

### Sign out a device

```http
DELETE /api/account/devices/:deviceId
Content-Type: application/json
```

Requires the account password and recent authentication.

### Sign out

```http
POST /logout
```

Ends the current Ace ID browser session and clears the session cookie.

## Connected services

### List connected services

```http
GET /api/account/services
```

Returns active OIDC services connected to the current account.

### Revoke a service

```http
DELETE /api/account/services/:clientId
```

Removes the OIDC grant associated with the specified client for the authenticated account.

## Password recovery

### Request reset

```http
POST /forgot-password
```

Requests password recovery. The public flow is designed not to reveal whether an email address exists.

### Reset password

```http
POST /reset-password
```

Consumes a valid password-reset token and changes the account password.

Successful password reset invalidates previous sessions and OIDC grants.

## OIDC interaction

The provider creates an interaction URL for each authorization request:

```text
/interaction/:uid
```

The interaction handles:

- User authentication
- Consent
- Authorization decisions

The application should not construct interaction IDs itself.

## UserInfo

Ace ID exposes UserInfo at:

```http
GET /me
```

The returned claims depend on the authenticated OIDC grant and supported scopes.

Use `sub` as the stable account identifier.

## Token revocation

```http
POST /token/revocation
```

Use OAuth token revocation when a client needs to invalidate a token.

## RP-initiated logout

```text
/session/end
```

Use the registered post-logout redirect configuration when returning the user to the relying party.

## Client management API

The service also exposes authenticated client-management endpoints for authorized bearer-token clients.

### Create client

```http
POST /clients
Authorization: Bearer <token>
Content-Type: application/json
```

### Get client

```http
GET /clients/:clientId
Authorization: Bearer <token>
```

### Update client

```http
PATCH /clients/:clientId
Authorization: Bearer <token>
Content-Type: application/json
```

### Delete client

```http
DELETE /clients/:clientId
Authorization: Bearer <token>
```

### Rotate client secret

```http
POST /clients/:clientId/rotate-secret
Authorization: Bearer <token>
```

Client management requires bearer authentication and ownership checks.

## Error handling

JSON APIs generally use an `error` field for machine-readable failure handling.

Common values include:

- `not_authenticated`
- `reauthentication_required`
- `password_required`
- `incorrect_password`
- `rate_limited`
- `too_many_attempts`
- `not_found`
- `server_error`

Applications should use HTTP status codes as the primary transport signal and treat error strings as implementation-level identifiers rather than human-facing copy.

## Security requirements

State-changing browser endpoints enforce same-origin validation when an Origin header is supplied. Do not disable browser origin protections or attempt to bypass them from application code.

Sensitive endpoints may additionally require recent authentication or the account password.

