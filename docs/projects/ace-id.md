---
title: "AceID"
description: "Technical documentation for AceID, an OpenID Connect and OAuth 2.0 identity and authentication service by The Ace Base."
---

# AceID

AceID provides authentication and identity infrastructure for applications built by or with The Ace Base.

It is an OpenID Connect (OIDC) provider with support for OAuth 2.0 authorization flows. Applications authenticate users through AceID and receive a verified identity that can be used to manage sessions, access protected resources, and personalize the user experience.

::: tip Integration Service
AceID is an integration service. You do not clone or self-host AceID. You integrate your application with it.
:::

## Installation

For JavaScript and Node.js applications, install the AceID SDK:

```bash
npm install ace-id-sdk
```

The SDK is the application-facing integration package.

## Provider

The production AceID issuer is:

```text
https://identity.ace-base.cc
```

Development uses:

```text
http://localhost:3000
```

The active issuer is controlled by the `ISSUER` environment variable.

## Prerequisites

Before integrating AceID, you need:

- An application that will use AceID
- An AceID application registration
- A client ID
- The appropriate client authentication configuration
- A registered redirect URI
- A registered post-logout redirect URI (when required)
- A development or production issuer
- The AceID SDK (when using the SDK integration)

AceID supports both public browser clients and confidential clients.

- **Public browser clients** use `token_endpoint_auth_method = none`.
- **Confidential clients** use `client_secret_basic`.

A public client does not receive a usable client secret from AceID.

## OpenID Connect

AceID implements OpenID Connect on top of OAuth 2.0.

The available OIDC claims include:

- `openid`
- `sub`
- `profile`
- `name`
- `preferred_username`
- `picture`
- `email`
- `email_verified`

These claims are returned according to the scopes requested and granted during authentication.

### Supported Scopes

AceID supports the following scopes:

- `openid`
- `profile`
- `email`
- `name`
- `username`
- `picture`

Unsupported scopes are filtered from the consent interface and from the granted scope set.

The standard OIDC scopes provide the following identity information:

| Scope | Information |
| --- | --- |
| `openid` | Subject identifier |
| `profile` | Name, username, picture |
| `email` | Email address and verification status |
| `name` | Name claim |
| `username` | Username claim |
| `picture` | Avatar URL |

## SDK Integration

### 1. Install the SDK

Install AceID's SDK using npm:

```bash
npm install ace-id-sdk
```

### 2. Configure the Application

Create the AceID application configuration in your environment.

The SDK uses the current Authorization Code + PKCE (S256) flow. Configure the installed SDK client with the Ace ID issuer and the exact application `redirectUri`.

Keep credentials outside source code. A typical environment contains the issuer and application-specific configuration:

```env
ISSUER=https://identity.ace-base.cc
```

Client credentials and other application configuration should be stored using your deployment platform's environment-variable or secret-management system.

### 3. Configure the Redirect URI

Register the callback URL used by your application.

For local development, an example is:

```text
http://localhost:3000/auth/callback
```

For production:

```text
https://example.com/auth/callback
```

The URI registered with AceID must correspond to the URI used by the application.

### 4. Start Authentication

Your application starts the authorization flow through the AceID SDK.

The flow is:

```text
Application
     │
     │ Authorization request
     ▼
   AceID
     │
     │ Login
     ▼
    User
     │
     │ Authentication
     ▼
   AceID
     │
     │ Authorization code
     ▼
Application callback
```

The authorization code is then exchanged according to the SDK's OIDC implementation.

### 5. Handle the Callback

Your application receives the authorization callback at the registered redirect URI.

The callback should:

1. Receive the authorization response.
2. Validate the response.
3. Exchange the authorization code where required.
4. Establish the application's authenticated state.
5. Redirect the user to the appropriate application page.

AceID supports PKCE using the `S256` method.

::: warning Public Clients
For public browser applications, PKCE should be used rather than relying on a client secret.
:::

## Direct Integration

You can also integrate with AceID without using the SDK by implementing the OpenID Connect flow directly.

The provider exposes the standard OIDC/OAuth interfaces required by the supported flow.

A direct integration consists of:

1. Discovering or configuring the AceID issuer.
2. Registering the application.
3. Sending the user to authorization.
4. Handling the callback.
5. Exchanging the authorization code.
6. Validating the resulting identity.
7. Creating the application's session.
8. Calling UserInfo when required.
9. Handling logout and token revocation.

The SDK abstracts these operations for supported JavaScript applications.

## Authorization Flow

AceID uses an authorization interaction before issuing an identity to the client.

The interaction consists of authentication and, when required, consent.

```text
Client application
     │
     │ Authorization request
     ▼
   AceID
     │
     ├── Login
     └── Consent
     │
     ▼
Authorization code
     │
     ▼
Client application
```

AceID owns the login and consent interaction interface.

### Login

When an OIDC interaction requires login, AceID checks whether the user already has an AceID session.

If there is no active session, AceID presents the login interface. A successful login creates the normal AceID session and associates the authenticated account with the OIDC interaction.

### Consent

After authentication, AceID can display the scopes requested by the client.

The consent interface shows the client's registered name and logo when available. Only supported scopes are displayed and granted.

### Allowing Access

When the user allows the request, AceID creates an OIDC grant for the authenticated account and client. The grant contains the filtered OIDC scopes requested by the client.

### Denying Access

If the user denies consent, AceID returns an OAuth error:

```text
access_denied
```

The provider returns the error through the client's configured redirect flow.

## Client Registration

AceID stores registered client applications with information including:

- Client ID
- Client secret
- Application name
- Logo
- Redirect URIs
- Grant types
- Response types
- Scopes
- Application type
- Token endpoint authentication method
- Post-logout redirect URIs

### Client ID

The client ID identifies the application to AceID. It is used during the authorization flow.

### Client Secret

Confidential clients may use a client secret. The secret must remain private.

Public clients explicitly registered with `none` do not receive a usable client secret, even if stale secret data exists in the database.

### Redirect URIs

Registered redirect URIs determine where AceID can return an authorization response. Applications should use an exact registered callback URL.

### Post-logout Redirect URIs

Applications can register destinations for post-logout redirects. These are used with the RP-initiated logout flow.

### Grant Types

AceID client configuration supports these default grant types:

```text
authorization_code
refresh_token
```

Applications should only request and use grant types supported by their registered client configuration.

### Response Types

The default response type is:

```text
code
```

This corresponds to the authorization-code flow.

### PKCE

AceID supports PKCE with:

```text
S256
```

PKCE is particularly important for public clients, including browser-based applications.

The basic flow is:

```text
Client
   │
   ├── Create code verifier
   ├── Create S256 challenge
   ▼
AceID authorization
   │
   ▼
Authorization code
   │
   ▼
Client
   ├── Send code
   └── Send verifier
   │
   ▼
Tokens
```

::: danger Security Warning
Do not expose a confidential client secret in browser code.
:::

## UserInfo

AceID provides an enabled UserInfo endpoint at:

```text
/me
```

The identity information available through UserInfo corresponds to the claims supported by the granted scopes.

Relevant claims include:

- `sub`
- `name`
- `preferred_username`
- `picture`
- `email`
- `email_verified`

The `sub` claim identifies the AceID account. The provider maps the AceID user's database ID to the OIDC subject identifier.

### Identity Claims

An authenticated AceID identity contains information derived from the user's account.

The identity representation includes:

- `sub`
- `name`
- `preferred_username`
- `email`
- `email_verified`
- `picture`

The `picture` claim is included when the account has an avatar URL.

#### Subject
The `sub` value is the string representation of the AceID user's internal account ID.
::: tip Stable Identity
Applications should use the OIDC subject (`sub`) as the stable identity identifier rather than using an email address as the primary identity key.
:::

#### Name
The `name` claim corresponds to the user's display name.

#### Username
The `preferred_username` claim corresponds to the user's username.

#### Email
The `email` claim contains the user's email address.

#### Email Verification
The `email_verified` claim indicates whether the user's email address is verified.

#### Picture
The `picture` claim contains the user's avatar URL when one is configured.

## Account API

AceID provides an authenticated account API.

### Get the Current Account

```http
GET /api/account
```

The endpoint requires an authenticated AceID session.

A successful response contains:

```json
{
  "id": "123",
  "email": "user@example.com",
  "email_verified": true,
  "username": "username",
  "display_name": "User Name",
  "avatar_url": "https://example.com/avatar.png"
}
```

The account response is generated from the current authenticated AceID user.

If the request is unauthenticated, AceID returns:

```json
{
  "error": "not_authenticated"
}
```

with HTTP status `401`.

### Update the Current Account

```http
POST /api/account
```

The endpoint accepts account fields including:

- `email`
- `username`
- `displayName`
- `avatarUrl`

A successful response returns the updated account representation.

An unauthenticated request returns:

```json
{
  "error": "not_authenticated"
}
```

### Delete the Current Account

```http
DELETE /api/account
```

The endpoint requires an authenticated AceID session.

When an account is successfully deleted, AceID destroys the current session and clears the session cookie.

A successful response is:

```json
{
  "success": true
}
```

## Registration

AceID provides account registration at:

```text
/register
```

Registration accepts:

- Email
- Password
- Username
- Display name

After successful registration, AceID creates a session and redirects the user to `/account`.

Applications using AceID's hosted authentication experience can use the registration flow rather than implementing account creation themselves.

## Login

AceID provides direct login at:

```text
/login
```

The login flow accepts:

- Email
- Password

When credentials are valid, AceID creates a session and redirects the user to `/account`.

Invalid credentials return HTTP `401`.

## Logout

AceID provides logout through:

```http
POST /logout
```

The logout operation:

1. Reads the current AceID session.
2. Destroys the session when present.
3. Clears the session cookie.
4. Redirects the user to `/`.

### Session Cookie

AceID uses the cookie:

```text
ace_id_session
```

The cookie is configured as:

- `HttpOnly`
- `SameSite=Lax`
- `Path=/`
- `Secure` (when AceID is running in production)

The session cookie has a maximum age of 30 days.

::: warning
Applications should not attempt to read the AceID session cookie directly from browser JavaScript because it is HTTP-only.
:::

## Password Reset

AceID provides password recovery through:

```text
/forgot-password
```

The password reset flow is designed to avoid account enumeration. Whether an email address belongs to an account does not change the public success response.

If an account exists and a reset has not been requested too recently, AceID creates a password reset token and sends a reset email.

### Reset Password

Password reset is completed through:

```text
/reset-password
```

The reset token is supplied to the reset page. The new password and confirmation must match.

An invalid or expired reset token cannot be used.

After a successful password reset, previous sessions are signed out.

## OIDC Endpoints and Features

AceID enables the following OIDC features:

| Feature | Status |
| --- | --- |
| OpenID Connect | Enabled |
| PKCE | Enabled with S256 |
| UserInfo | Enabled |
| Token revocation | Enabled |
| RP-initiated logout | Enabled |
| Development interaction UI | Disabled |

### Token Revocation

AceID supports OAuth 2.0 token revocation at:

```http
POST /token/revocation
```

Use token revocation when an application needs to explicitly invalidate a token through the supported OAuth flow.

### RP-Initiated Logout

AceID supports OpenID Connect RP-initiated logout at:

```text
/session/end
```

Applications can use the registered post-logout redirect configuration when implementing the logout experience.

### OIDC Interaction

AceID's OIDC interaction endpoint is:

```text
/interaction/:uid
```

The interaction URL is generated for each OIDC interaction.

The interaction handles:

- Login
- Consent
- Authorization decisions

The login submission creates the AceID session and associates the authenticated account with the current OIDC interaction. The consent submission creates the appropriate OIDC grant after the user allows access.

## Application Integration Example

A typical application using AceID follows this structure:

```text
Your Application
     │
     ├── Sign in
     │      │
     │      ▼
     │    AceID
     │      │
     │      ▼
     │    Callback
     │      │
     │      ▼
     │    Session
     │
     ├── Account
     ├── Protected routes
     └── Sign out
```

AceID handles identity authentication.

Your application handles its own:

- UI
- Business logic
- Authorization
- Application data
- Protected resources

### Public Browser Applications

Browser applications are public clients.

A public client must be registered with:

```text
token_endpoint_auth_method = none
```

AceID deliberately does not expose a usable client secret to such a client.

Use PKCE with `S256` for the authorization-code flow.

Never put a confidential client secret into:

- Browser JavaScript
- HTML
- Public GitHub repositories
- Frontend environment variables exposed to the browser

### Confidential Applications

Server-side applications can use confidential-client authentication.

The default confidential client authentication method is:

```text
client_secret_basic
```

Keep the client secret exclusively on the server. Store it in your application's secret or environment-variable system.

## Environment Configuration

AceID's own service requires these environment variables:

```env
ISSUER
DATABASE_URL
SESSION_SECRET
JWKS_JSON
```

All four are required.

### ISSUER
The URL used as the AceID OpenID Connect issuer.
- Production: `https://identity.ace-base.cc`
- Development: `http://localhost:3000`
The actual value is supplied through `ISSUER`.

### DATABASE_URL
The PostgreSQL database connection used by AceID.

### SESSION_SECRET
The secret used for AceID provider cookies and session-related security.

### JWKS_JSON
The JSON Web Key Set containing AceID's persistent signing keys. It must contain a non-empty `keys` array.

## Database-Backed OIDC Storage

AceID persists OIDC provider state using PostgreSQL.

The provider uses a PostgreSQL adapter for persistent OIDC storage.

Registered clients are stored in:

```text
aceid_clients
```

OIDC provider state is stored in:

```text
aceid_oidc_store
```

Expired OIDC records are excluded when they are retrieved from persistent storage.

## Production Deployment

AceID is designed to run behind a TLS-terminating proxy in production.

The service trusts the upstream proxy and determines production behavior from either `NODE_ENV=production` or `RENDER` being present.

In production, AceID uses secure cookies. The production issuer is:

```text
https://identity.ace-base.cc
```

## Security

### Keep Secrets Private
Never expose:
- Client secrets
- Session secrets
- Private signing keys
- Database credentials

### Use HTTPS
Production authentication should use HTTPS. The production AceID issuer uses `https://identity.ace-base.cc`.

### Use PKCE
Public clients should use PKCE with `S256`. AceID supports this method.

### Validate Authentication Results
Do not treat a browser redirect alone as proof that a user is authenticated. The authorization response and resulting tokens must be handled according to the OIDC flow.

### Do Not Use Email as the Primary Identity
Use the OIDC `sub` claim as the stable identity identifier. AceID maps the authenticated account ID to the `sub` claim.

### Protect Sessions
AceID's own session cookie is HTTP-only and uses `SameSite=Lax`. In production it is also marked `Secure`.

## Troubleshooting

### `redirect_uri` errors
Check that the redirect URI used by the application matches the URI registered for its AceID client. Check:
- Scheme
- Host
- Port
- Path
- Environment

### Login succeeds but the application is not authenticated
Check that the callback handler completes the authorization flow and establishes the application's session.

### Public client authentication fails
Verify that the client is registered with `token_endpoint_auth_method = none` and that the application is using PKCE with `S256`.

### UserInfo does not contain a claim
Check the scopes requested by the application. AceID only supports the documented identity scopes and filters unsupported scopes.

### Consent shows unexpected scopes
AceID filters requested scopes against its supported scope list before displaying and granting them. Supported scopes are:
`openid`, `profile`, `email`, `name`, `username`, `picture`.

### Account endpoint returns 401
The request does not have a valid AceID session. The current account endpoint requires the `ace_id_session` session cookie.

## API Reference

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/` | AceID home |
| GET | `/register` | Registration page |
| POST | `/register` | Create an account |
| GET | `/login` | Login page |
| POST | `/login` | Authenticate with email and password |
| GET | `/account` | Authenticated account page |
| GET | `/api/account` | Get current account |
| POST | `/api/account` | Update current account |
| DELETE | `/api/account` | Delete current account |
| POST | `/logout` | End the AceID session |
| GET | `/forgot-password` | Password recovery |
| POST | `/forgot-password` | Request password reset |
| GET | `/reset-password` | Password reset page |
| POST | `/reset-password` | Update password |
| GET | `/interaction/:uid` | OIDC interaction |
| POST | `/interaction/:uid` | Submit OIDC interaction |
| GET | `/me` | OIDC UserInfo |
| POST | `/token/revocation` | OAuth token revocation |
| GET | `/session/end` | OIDC RP-initiated logout |

The application-facing account and authentication routes are implemented by the AceID service.

## AceID SDK

**Package:** `ace-id-sdk`

**Install:**
```bash
npm install ace-id-sdk
```

**Use the SDK for:**
- Authentication
- Authorization-code flows
- PKCE-based public-client flows
- Callback handling
- AceID identity integration
- Session integration

Use the SDK's version-specific API for the exact initialization and method signatures.

## Private Source

AceID is maintained privately under:

```text
aceyash-dev/ace-id
```

The private source repository is not required to integrate AceID.

Applications use `ace-id-sdk` or the supported OpenID Connect interfaces exposed by `https://identity.ace-base.cc`.

No source checkout or self-hosted AceID instance is required for normal application integration.

## Latest SDK authentication flow

The current application-facing SDK flow uses **Authorization Code + PKCE (S256)**. The SDK handles the browser redirect, state/nonce generation, PKCE verifier/challenge generation, callback validation, token exchange, and token refresh.

### Install

Use the current package:

```bash
npm install ace-id-sdk
```

### Provider configuration

Use the production Ace ID issuer:

```text
https://identity.ace-base.cc
```

Your application registration in AIDC should contain the exact callback URL used by the SDK:

```text
https://example.com/auth/callback
```

For local development:

```text
http://localhost:3000/auth/callback
```

Do not put a confidential client secret in browser code. Browser applications are public clients and should use PKCE.

### Flow

The SDK performs this sequence:

```text
Your app
   │
   │ signIn({ returnTo? })
   ▼
Ace ID authorization endpoint
   │
   │ login + consent
   ▼
Authorization code
   │
   │ redirect_uri + code + state
   ▼
Your callback URL
   │
   │ handleCallback()
   │   ├─ validate state
   │   ├─ validate transaction TTL
   │   ├─ exchange code
   │   └─ verify identity
   ▼
Authenticated session
   │
   ├─ getUser()
   ├─ getSession()
   ├─ getAccessToken()
   └─ getValidAccessToken()
```

PKCE uses the **S256** challenge method. The SDK generates the verifier and challenge for the authorization transaction and keeps the transaction state in browser session storage by default.

### Browser callback

After the provider redirects back to your registered callback URL, pass the callback URL to the SDK's callback handler:

```js
await client.handleCallback();
```

The handler validates the OAuth response and the stored transaction before exchanging the authorization code. Applications should not treat the presence of a `code` query parameter alone as proof of authentication.

### Session and tokens

Use the SDK's session helpers instead of reading Ace ID cookies directly:

```js
const authenticated = client.isAuthenticated();
const user = await client.getUser();
const session = client.getSession();
const accessToken = await client.getValidAccessToken();
```

When a refresh token is available and supported by the registered client, the SDK can refresh tokens:

```js
await client.refresh();
```

The SDK shares an in-flight refresh operation so concurrent calls do not unnecessarily start multiple refresh requests.

### Recommended application structure

A browser application should keep the integration small:

1. Configure the SDK with the Ace ID issuer and the application's exact `redirectUri`.
2. Start authentication with `signIn()`.
3. Handle the registered callback with `handleCallback()`.
4. Establish application UI state from `isAuthenticated()`, `getUser()`, or `getSession()`.
5. Use `getValidAccessToken()` when a protected API request needs an access token.
6. Refresh through the SDK rather than implementing a second refresh flow.
7. Sign out through your application's chosen Ace ID/OIDC logout flow.

### AIDC setup checklist

Before running the flow:

- Create the application in AIDC.
- Set the **Origin URL** to the application origin when browser-origin validation is required.
- Add the exact callback under **URL Configs → Redirect URIs**.
- Configure the required OIDC scopes.
- Use a public-client configuration with `token_endpoint_auth_method = none` for browser-only applications.
- Keep confidential client credentials exclusively on the server.
- Use HTTPS in production.

::: warning SDK API surface
The SDK API is versioned. The flow above describes the current `ace-id-sdk` integration model; use the installed package's exported client constructor and TypeScript types for the exact initialization signature.
:::

## Frequently asked questions

### How does AceID authentication work?

AceID provides OpenID Connect and OAuth 2.0 authorization flows. Applications authenticate through the AceID provider, receive an authorization response, and establish their own application session.

### Should public browser clients use PKCE?

Yes. Public browser clients should use PKCE with the S256 code challenge method rather than relying on a client secret.

### What SDK package is used for AceID?

The application-facing JavaScript and Node.js package is `ace-id-sdk`, installed with `npm install ace-id-sdk`.
