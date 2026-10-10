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

## Adaptive authentication and risk-based step-up

Password sign-ins evaluate a conservative, deterministic risk score using signals Ace ID already records: whether the browser is trusted, recent active-session history, IP-address change, and user-agent change. This is not an ML classifier or an external IP-reputation service.

An unfamiliar browser by itself does not block sign-in. When the score reaches the high-risk threshold, Ace ID requests cross-device approval only when another live trusted session is available to approve the request. Accounts with TOTP MFA already follow the MFA challenge flow. When no safe approval path exists, the adaptive rule does not create an approval request that the user cannot complete.

Risk step-up decisions are recorded in Account Logs with a bounded score and reason codes. Raw session tokens and challenge secrets must never be written to security logs.

## Security notification email

Ace ID sends transactional security notifications through Resend for new-device sign-ins and security-sensitive account changes, including passkey/TOTP changes, password changes and recovery, trusted-device updates, session revocation, account recovery, and connected-application access revocation. GitHub-created accounts receive one welcome email through the central authentication callback.

Production deployments must configure `RESEND_API_KEY` and should explicitly set `RESEND_FROM_EMAIL` to an address on the verified sending domain. `RESEND_FROM_NAME` and `MAIL_FROM` are optional sender overrides. The service uses a verified `ace-base.cc` sender fallback when an API key is configured and no explicit sender is set. An API acceptance response is not proof that a recipient mailbox displayed the email; inspect Resend delivery logs and bounces during production verification.

Email delivery failures are logged without exposing passwords, reset tokens, MFA recovery codes, or session cookies, and a provider outage does not undo a completed account-security change. This preserves the security alert path without turning email delivery into a hidden authentication dependency.

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
