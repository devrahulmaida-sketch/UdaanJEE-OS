# Advanced Services API

## Learning Service
- `GET /health`
- `GET /v1/topics`
- `GET /v1/topics/recommended?studentId=...&limit=...`

## Planner Service
- `GET /health`
- `POST /v1/plans/generate`
- `POST /v1/plans/rebalance`

## Assessment Service
- `GET /health`
- `POST /v1/tests/score`
- `POST /v1/tests/generate`

## Analytics Service
- `GET /health`
- `GET /v1/students/{id}/performance`
- `GET /v1/students/{id}/interventions`
