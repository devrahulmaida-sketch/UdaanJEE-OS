# SRE and Reliability Targets

## SLO Baseline
- API gateway availability: 99.9%
- Planner job success rate: 99.5%
- Test submission durability: 99.99%
- Notification dispatch success: 99.0%

## Error Budgets
- Monthly error budget tracked per domain service
- Freeze policy triggered after 50% budget burn in first 10 days

## Incident Model
- Severity levels: SEV-1 to SEV-4
- SEV-1 response SLA: 15 minutes
- Postmortem required within 72 hours for SEV-1/SEV-2
