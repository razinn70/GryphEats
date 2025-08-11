# ADR 0002: API Gateway Pattern

Date: 2025-08-11

## Status
Accepted

## Context
Multiple backend microservices (user, recipe, social, recommendation, notification) will serve browser + future mobile clients. We need a single ingress for routing, auth, rate limiting, and observability correlation.

## Decision
Adopt a lightweight Express-based API Gateway initially (reverse proxy + middleware). It will handle: CORS, JWT verification, request ID/trace header propagation, coarse rate limiting, and route to internal services via service-specific prefixes.

## Consequences
Pros:
- Fast to implement, flexible Node middleware ecosystem, easy local dev.
Cons:
- Not as performant or feature-rich as Envoy/Kong; future migration required when advanced policies needed.

## Alternatives
Envoy: Higher initial complexity. Kong: additional runtime + DB overhead.

## Follow-ups
- Introduce OpenTelemetry instrumentation library.
- Evaluate migration to Envoy once traffic & policy complexity justify.
