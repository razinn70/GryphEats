# Campus Recipe Platform Monorepo

Early-stage monorepo scaffolding for a FAANG-ready, microservices-driven campus recipe & meal planning platform.

## Current Scope (Bootstrap Phase)
- API Gateway (Express proxy) with health endpoint
- User Service (stub) connected to Postgres
- Recipe Service (stub) connected to Postgres
- Shared Types library (event & domain type placeholders)
- Docker Compose: Postgres, Redis, Elasticsearch, Jaeger, services
- ADR system with first decision recorded

## Getting Started
Prerequisites: Node 20+, Docker, (optional) pnpm or npm 9+.

### Install Dependencies
```
pnpm install
```

### Run Local Stack (Services + Infrastructure)
```
cd infra
docker compose up --build
```
Gateway available at http://localhost:4000/healthz

### Dev (Hot Reload Individual Service)
```
pnpm dev:gateway
pnpm dev:user
pnpm dev:recipe
```

## Directory Layout
services/           # Microservices (gateway, user, recipe ...)
libs/shared-types   # Reusable TS types & event schemas
infra/              # Docker Compose, infra config
ops/adr/            # Architecture Decision Records
frontend/           # (Legacy Vite app - to be migrated to Next.js)
backend/            # (Legacy Express + Mongo - will be decomposed)

## Next Steps
1. Add proper tracing (OpenTelemetry lib) & propagate req IDs
2. Implement real JWT auth in gateway & user service
3. Introduce migrations (Drizzle/Prisma) for Postgres schema
4. Recipe DB schema + initial CRUD endpoints
5. Replace legacy backend with new services gradually

## ADRs
See `ops/adr/` for decision history. Use `template.md` for new entries.

## Contributing
1. Create feature branch
2. Add/update ADR if architecture changes
3. Keep services isolated (no cross-service DB access)

## License
Pending (choose later: MIT / Apache-2.0)

---
_Scaffold generated as foundation for further expansion (search, social, ML, notifications)._ 
