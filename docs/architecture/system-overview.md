# System Overview

## High-level architecture

- Multi-client presentation layer (`apps/web`, `apps/mobile`, `apps/admin`)
- API gateway for auth, routing, and policy enforcement
- Domain microservices for planning, learning, assessment, analytics, notifications
- AI orchestration service for recommendation and explanation pipelines
- Event-driven backbone with queue and stream abstraction
- PostgreSQL + Redis + object storage persistence tier

## Reliability targets

- 99.9% monthly availability target
- Graceful degradation for AI features
- Offline sync conflict resolution for mobile clients

## Security baseline

- JWT with rotating refresh tokens
- RBAC and scoped permissions
- PII minimization and encryption at rest
- Audit logs for moderation actions
