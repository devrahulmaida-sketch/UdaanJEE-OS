# Disaster Recovery Plan

## Targets
- RPO: 15 minutes for core transactional stores
- RTO: 60 minutes for student-facing baseline APIs

## Strategy
- Continuous WAL shipping for PostgreSQL
- Multi-zone Redis with persistence snapshots
- Daily object storage integrity checks

## Recovery drills
- Monthly tabletop incident simulations
- Quarterly full restore drill in staging
- Post-drill action tracking in operations board
