# Security Architecture

## Zero-trust controls
- Service-to-service auth via signed workload identity
- Default deny network policies in Kubernetes
- Tenant-scoped RBAC checks on every write path

## Data protection
- PII classification and retention controls
- Field-level encryption for sensitive student attributes
- Immutable audit logs for moderation and account actions

## AppSec pipeline
- SAST on pull requests
- Dependency vulnerability scanning
- IaC static checks for Terraform and Kubernetes manifests

## Abuse prevention
- Rate limiting by IP + user + tenant
- Spam and toxicity classifiers for community channels
- Graduated trust levels for new accounts
