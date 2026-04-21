# API Gateway Contract v1

## Base routes
- `GET /api/v1/health`
- `GET /api/v1/features`
- `GET /api/v1/roadmap`

## Student routes
- `POST /api/v1/students/onboard`
- `GET /api/v1/students/{id}/dashboard`
- `POST /api/v1/students/{id}/study-plans`

## Planner routes
- `POST /api/v1/plans/generate`
- `POST /api/v1/plans/recover-backlog`
- `GET /api/v1/plans/{id}`

## Assessment routes
- `POST /api/v1/tests/start`
- `POST /api/v1/tests/{attemptId}/submit`
- `GET /api/v1/tests/{attemptId}/analysis`

## Doubt routes
- `POST /api/v1/doubts`
- `POST /api/v1/doubts/{id}/hints`
- `POST /api/v1/doubts/{id}/resolve`
