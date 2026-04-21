# Deployment Guide (Initial)

## Local development

1. Install Node.js 20+
2. Run `npm install`
3. Run service-specific scripts as they are introduced

## Docker rollout plan

- Compose stack for local integrated development
- Tagged images for each app and service

## Kubernetes rollout plan

- Namespace-per-environment model
- Helm charts in `infra/k8s` (planned)
