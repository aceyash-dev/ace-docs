---
title: "AIDC"
description: "Technical documentation for AIDC, The Ace Base application and origin verification service."
---

# AIDC

AIDC is an application and origin-configuration service from **The Ace Base**.

It provides application configuration around registered origins and redirect URIs, including DNS-based Origin URL verification.

## Origin URL verification

An application can configure an Origin URL in AIDC. Before an origin is accepted, AIDC provides a DNS TXT challenge for the domain.

The challenge uses:

```text
Name:  _aceid-challenge.<your-domain>
Type:  TXT
Value: token=<challenge-token> expiry=never
```

Add the TXT record at the DNS provider that manages the domain, then use **Verify TXT record** in AIDC.

DNS propagation can take time. AIDC checks the record through multiple DNS resolvers before accepting the verification.

## Cloudflare automation

For domains managed by Cloudflare, AIDC can add the verification TXT record automatically.

The Cloudflare action:

1. Receives a Cloudflare API token for the current request.
2. Finds the matching active Cloudflare zone.
3. Checks whether the AIDC TXT challenge already exists.
4. Creates the TXT record only when it is missing.
5. Runs the normal AIDC DNS verification flow afterward.

The API token is used only for the request and is not stored by AIDC.

Use a Cloudflare API token with DNS write permission restricted to the required zone. Do not use a Cloudflare Global API Key.

For DNS providers other than Cloudflare, use the TXT record shown directly in the AIDC Origin URL configuration and verify it normally.

## Redirect URIs

Redirect URIs remain application configuration and are separate from Origin URL DNS verification.

Register exact callback URLs. Do not use wildcard redirect URIs.

## Security notes

- Keep Cloudflare API tokens private.
- Prefer a narrowly scoped Cloudflare token over account-wide credentials.
- Do not put DNS credentials in frontend source code or application configuration committed to a repository.
- Origin verification does not replace redirect URI validation.
- OIDC callback validation remains the responsibility of the integrating application and its authentication flow.

## Related resources

- [AceID](/projects/ace-id)
- [AceID API Reference](/projects/ace-id-api)
- [AceID Security](/projects/ace-id-security)
- [AceID SDK Guide](/projects/ace-id-sdk)
