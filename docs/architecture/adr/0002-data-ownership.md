# ADR-0002: Data Ownership and Access

## Context
Cross-domain analytics needs must not collapse service boundaries.

## Decision
Each service owns its primary write model. Read-side projections are published through events and consumed into analytics-optimized stores.

## Consequences
- Clear ownership and safer domain evolution
- Eventual consistency between views
- Requires schema evolution discipline
