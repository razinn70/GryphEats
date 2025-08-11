# ADR 0003: Primary Database & Future Sharding Strategy

Date: 2025-08-11

## Status
Accepted

## Context
Relational consistency needed for core entities (users, recipes, social graph edges). Growth may introduce hotspots (popular recipes, large follow graphs). Need a path to scale reads & writes.

## Decision
Use PostgreSQL as primary OLTP store. Start with single instance. Mid-term: add read replicas for heavy read endpoints (public recipe catalog, profile views). Long-term: apply functional sharding:
- User-based shard key (user_id hash) for high-volume per-user tables (meal plans, notifications)
- Recipe-based shard key for write-heavy interaction tables (likes, comments) if contention arises.
Maintain a global reference table for user & recipe ID allocation (Snowflake-style or UUID v7) to avoid cross-shard ID collisions.

## Consequences
Pros:
- Strong consistency, rich querying, mature ecosystem.
Cons:
- Requires custom routing layer when sharded; more ops complexity later.

## Alternatives Considered
MongoDB: Flexible but weaker relational constraints for follow graph integrity.
CockroachDB: Built-in scale but higher resource overhead now.

## Follow-ups
- Add connection pool metrics.
- Implement read/write splitting when replicas introduced.
- Evaluate partitioning on interaction tables before full sharding.
