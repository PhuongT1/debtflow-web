# ADR 003: Versioning and independent delivery

Status: accepted

## Decision

`packages/mfe-registry/src/manifest.json` is the versioned topology contract. It records app package/version, framework metadata, exclusive routes, health path, required contract majors and the names of environment variables. It deliberately does not contain environment-specific origins or secrets.

Every deployment environment supplies its own origins and feature flags. CI validates the JSON Schema, workspace versions, route ownership and contract compatibility. Deploy the zone first, smoke-test its health/direct URL, then cut traffic over by changing gateway configuration. Rollback changes the route/origin or artifact; unrelated zones are not rebuilt.

Shared workspace packages are source-level development contracts today. If teams move to separate repositories, publish them with immutable semantic versions or generate an API client from versioned OpenAPI; do not copy source between apps.
