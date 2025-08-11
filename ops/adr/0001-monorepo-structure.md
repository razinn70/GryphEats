# ADR 0001: Adopt Monorepo with Workspaces

Date: 2025-08-11

## Status
Accepted

## Context
We are building a multi-service platform (gateway, user, recipe, future social, recommendation, notification). Early shared types, consistent tooling, and atomic refactors are desirable. Multiple repos would slow iteration and complicate cross-service changes at this early stage.

## Decision
Use a single monorepo with package manager workspaces (initially plain workspaces; can add Turborepo later). Shared libraries (types, tracing helpers) live under `libs/`. Each service owns its `package.json` and Dockerfile. Root scripts orchestrate local dev.

## Consequences
Pros:
- Easier refactors across services
- Single source of truth for dependency versions
- Faster onboarding & consistent tooling
Cons:
- Larger repo size over time
- Requires CI filtering to avoid rebuilding all services unnecessarily (future optimization)

## Alternatives Considered
1. Polyrepo: Higher integration overhead at early stage.
2. Submodules: Operational complexity outweighs benefits.

## Follow-ups
- Introduce Turborepo for build caching (future ADR)
- Enforce ownership CODEOWNERS file
