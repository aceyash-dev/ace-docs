# Self-hosting Ace ID

Ace ID can be self-hosted with PostgreSQL. Self-hosting gives a developer or organization its own identity authority and identity database. It does not turn Ace ID into a user-data synchronization service.

## Identity model

A self-hosted deployment owns the accounts and authentication identities in its own Ace ID database.

That database can contain:

- Ace ID user ID
- username and profile identity data
- GitHub account linkage
- authentication and security state
- OIDC client and authorization state
- session/authentication state

Application data stays in the application's own database.

```
Self-hosted deployment
│
├── Ace ID
│   └── PostgreSQL
│       └── identity/account data
│
├── Application A
│   └── PostgreSQL
│       └── application data
│
└── Application B
    └── PostgreSQL
        └── application data
```

Applications use the stable OIDC `sub` returned by Ace ID as the identity reference. They do not need to create another login account for the same person.

## One identity across applications

A user can authenticate to multiple applications through the same Ace ID deployment:

```
                    Ace ID
                      │
             ace_123 / user identity
              /       |       \
             ▼        ▼        ▼
          App A     App B    App C
```

The applications can each have an `app_users` record keyed by `ace_123`, but those records are application data, not separate Ace ID login accounts.

## Privacy and isolation

Ace ID does not automatically synchronize:

- users between applications
- application profiles
- application databases
- application activity
- application content

An application receives identity claims according to its OIDC client configuration and requested scopes. It should store only the application data it needs.

Application A should not be able to read Application B's database merely because both use the same Ace ID deployment.

## Hosted versus self-hosted

The hosted Ace ID service can continue using the existing production infrastructure:

```
identity.ace-base.cc
        │
        ▼
      Neon
```

A self-hosted deployment can instead use:

```
id.example.com
      │
      ▼
   Ace ID
      │
      ▼
developer PostgreSQL
```

These are separate identity authorities. Self-hosting does not automatically copy or migrate users from the hosted Ace ID service.

## PostgreSQL

Set `DATABASE_URL` to the PostgreSQL instance used by the Ace ID deployment.

For the existing hosted deployment, keep:

```env
DATABASE_SSL=require
```

For a trusted local/private PostgreSQL connection where TLS is intentionally not configured:

```env
DATABASE_SSL=disable
```

For certificate-verified TLS:

```env
DATABASE_SSL=verify-full
```

Use a persistent database and backups for production deployments.

## GitHub SSO

GitHub remains the SSO provider.

Set:

```env
GH_CLIENT_ID=...
GH_CLIENT_SECRET=...
GITHUB_REDIRECT_URI=https://id.example.com/auth/gh/callback
```

If `GITHUB_REDIRECT_URI` is omitted, Ace ID derives it from `ISSUER`:

```
{ISSUER}/auth/gh/callback
```

The GitHub OAuth application's callback URL must match the deployed callback URL.

## Required configuration

At minimum:

```env
NODE_ENV=production
ISSUER=https://id.example.com
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/ace_id
DATABASE_SSL=require
SESSION_SECRET=<long-random-secret>
JWKS_JSON=<persistent-oidc-jwks>
GH_CLIENT_ID=<github-oauth-client-id>
GH_CLIENT_SECRET=<github-oauth-client-secret>
GITHUB_REDIRECT_URI=https://id.example.com/auth/gh/callback
```

Keep `SESSION_SECRET` and OIDC signing keys private. Do not commit them to source control.

## Deployment principle

Self-hosting should change **where Ace ID runs**, not what Ace ID means.

The core boundary is:

> **Ace ID owns identity. Applications own application data.**

That gives developers a single login identity across their applications without requiring every application to maintain its own independent login account.
