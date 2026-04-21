# ADR-0001: Microservice Boundary Strategy

## Context
UdaanJEE OS requires rapid iteration while preserving scale and ownership clarity.

## Decision
Adopt domain-oriented microservices with explicit API and event contracts, starting with gateway, planner, learning, assessment, analytics, AI, and notifications.

## Consequences
- Independent scaling and release cadence per domain
- Added complexity for local orchestration
- Contract governance required to avoid drift
