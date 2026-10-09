---
title: "AIDC"
description: "Technical documentation for AIDC, The Ace Base application and origin configuration service."
---

# AIDC

AIDC is an application and Origin URL configuration service from **The Ace Base**. It helps developers configure application origins, redirect URIs, and project metadata for Ace ID integrations.

## Origin URL configuration

Origin URL configuration does **not** require DNS TXT verification. You do not need to create _aceid-challenge TXT records, wait for DNS propagation, or provide DNS-provider credentials to save an Origin URL.

AIDC validates the URL and applies the configured origin policy. Removing DNS ownership checks does not make an origin trusted by itself: applications must still use exact, registered redirect URIs, and authentication callbacks must be validated by the integrating application.

### What is still required

- Use a valid URL with an explicit origin.
- Use HTTPS for production origins.
- Ensure the hostname has ordinary DNS records and resolves for clients that need to reach it. This is normal connectivity, not an ownership-verification challenge.
- Register exact callback and post-logout redirect URIs. Wildcards are not a substitute for validation.
- Keep application authorization checks on the server.

### What is no longer required

- No _aceid-challenge.<domain> TXT record.
- No DNS resolver verification flow.
- No waiting for TXT-record propagation.
- No Cloudflare API token or DNS-write permission for Origin URL setup.

## Redirect URIs

Redirect URIs remain separate from Origin URL configuration. Register exact callback URLs and post-logout redirect URLs. Do not use wildcard redirect URIs. OIDC callback validation remains the responsibility of the integrating application and its authentication flow.

## Project configuration

AIDC is also the source of project-level Ace ID configuration. A configured project can contain a .aid.json file with the issuer, application/client identifiers, redirect URI, scopes, and project metadata.

Example configuration:

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

The JavaScript/TypeScript SDK can consume this configuration through createAIDFromProjectConfig(). AIDC owns the project file and setup workflow; the SDK does not read .aid.json or .env files directly.

## Security notes

- Do not put secrets or provider credentials in frontend source code or committed project configuration.
- Origin URL configuration is not an authorization boundary and does not replace redirect URI validation.
- Validate OIDC state, nonce, PKCE, and callback parameters according to the client type and flow.
- Keep confidential client secrets exclusively on the server.
- Use HTTPS in production.

## Related resources

- [AceID](/projects/ace-id)
- [AceID API Reference](/projects/ace-id-api)
- [AceID Security](/projects/ace-id-security)
- [AceID SDK Guide](/projects/ace-id-sdk)
