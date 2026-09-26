---
title: "Ace ID Security"
description: "Security architecture and operational controls for Ace ID."
---

# Ace ID Security

Ace ID is designed around server-side authentication state, standards-based OIDC, short-lived authentication transactions, and explicit security controls for account changes.

## Threat model

The service protects against common identity-service risks including:

- Cross-site request forgery against browser mutations
- Session theft and insecure cookie handling
- OAuth authorization-code interception
- Replay of authentication transactions
- Reuse of password-reset tokens
- MFA challenge replay and brute force
- Recovery-code reuse
- Unauthorized passkey registration
- Unauthorized device/session management
- Excessive authentication attempts
- Accidental disclosure of client secrets

No authentication system eliminates every deployment risk. Applications remain responsible for protecting their own sessions, authorization rules, secrets, and downstream APIs.

## Session security

Ace ID uses server-side sessions rather than putting the complete authentication state in a browser-readable token.

Production session cookies:

- Are HTTP-only
- Use `SameSite=Lax`
- Use `Secure`
- Use the `__Host-` prefix
- Have `Path=/`
- Have a 30-day maximum age

Browser JavaScript should not read the session cookie.

## Same-origin browser mutations

State-changing browser endpoints validate the request's Origin against the configured Ace ID issuer origin when an Origin header is present.

This protection covers account and security mutations such as:

- Registration
- Login
- Passkey operations
- MFA operations
- Account updates
- Password changes
- Device sign-out
- Connected-service revocation
- Onboarding completion
- Email-verification requests
- Password recovery
- Account deletion
- Logout

OIDC interaction and bearer-token API endpoints are intentionally handled separately because their authentication models differ.

## OAuth and PKCE

Public clients use Authorization Code + PKCE with S256.

The provider validates the authorization transaction before issuing tokens.

Applications should:

1. Generate a cryptographically random PKCE verifier.
2. Derive the S256 challenge.
3. Preserve state and nonce for the transaction.
4. Validate the callback.
5. Exchange the authorization code.
6. Validate the resulting identity.

Confidential clients must keep their client secret on the server.

## Password security

Passwords are hashed with bcrypt.

Password changes require the current password and invalidate existing sessions and OIDC grants after the change.

Password-reset tokens are random values whose SHA-256 hashes are stored in the database. Reset tokens:

- Expire after a limited lifetime.
- Are atomically claimed.
- Cannot be reused after consumption.
- Cause existing sessions and OIDC grants to be invalidated after a successful reset.

The reset-request flow is designed to avoid account enumeration.

## MFA security

TOTP secrets are encrypted at rest using authenticated encryption.

Recovery codes are stored as SHA-256 hashes rather than plaintext.

MFA challenges:

- Are random.
- Expire after a short lifetime.
- Have a maximum number of attempts.
- Are locked and consumed transactionally.
- Remove a successfully used recovery code atomically.

This prevents concurrent requests from successfully consuming the same recovery credential.

## Passkey security

Passkey registration requires recent authentication.

Registration uses a short-lived challenge and a browser challenge cookie. The server verifies the WebAuthn registration response before storing the credential public key.

Credential IDs are checked for uniqueness before saving a new passkey.

## Account Logs

Account Logs provide user-visible security history without exposing another user's records.

The API always scopes queries to the authenticated account and caps responses at 100 newest records.

Logged metadata is event-specific. Authentication logs include request-derived device information and trusted deployment location headers where available.

Account Logs are not a replacement for server-side audit infrastructure. They are the user-facing activity history.

## Security headers

Ace ID sets defensive response headers including:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- A restrictive `Permissions-Policy`

Production also enables HSTS.

## Rate limiting

Authentication-sensitive operations use a conservative process-local rate guard.

Protected areas include password login, MFA, passkeys, and device-related operations.

The rate guard is intentionally lightweight. Deployments that require distributed or account-level abuse protection should place a shared rate limiter or edge protection in front of the service.

## OIDC grants

Connected application grants are stored server-side.

When a user revokes a connected service, associated grant records are removed. Password resets also invalidate OIDC grants.

## Secrets

The following must remain server-side:

- Database credentials
- Session secret
- OIDC signing keys / JWKS private material
- Confidential client secrets
- Mail credentials
- Any deployment-specific service credentials

Never place them in browser JavaScript, public repositories, frontend environment variables, or generated static assets.

## Production deployment

Use HTTPS and a trusted TLS-terminating proxy.

The service recognizes production behavior when `NODE_ENV=production` or the supported deployment environment signal is present. Production cookies are then marked Secure.

Do not expose PostgreSQL directly to the public internet.

## Security checklist

Before production:

- [ ] HTTPS is enforced.
- [ ] `ISSUER` is the production issuer.
- [ ] Session secrets are generated securely.
- [ ] OIDC signing keys are protected.
- [ ] Database credentials are stored as secrets.
- [ ] Public clients use PKCE S256.
- [ ] Confidential secrets remain server-side.
- [ ] Redirect URIs are exact and registered.
- [ ] Post-logout redirect URIs are registered.
- [ ] Application authorization is enforced independently of authentication.
- [ ] Account Logs are available to authenticated users.
- [ ] Deployment-level rate limiting is considered for high-risk environments.
