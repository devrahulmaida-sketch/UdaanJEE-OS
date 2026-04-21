# Operations Runbook

## Service startup checklist
- Validate environment variables
- Confirm database and redis availability
- Confirm `/health` endpoint status

## Incident triage checklist
- Identify affected services and user impact
- Roll back last deployment if required
- Communicate incident status every 30 minutes

## Recovery checklist
- Verify queue backlog drain
- Confirm synthetic checks pass
- Update postmortem template and assign owner
