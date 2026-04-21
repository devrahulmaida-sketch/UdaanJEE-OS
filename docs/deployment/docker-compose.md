# Deployment: Docker Compose (Infra Baseline)

## Prerequisites

- Docker Engine installed
- Docker Compose plugin available (`docker compose`)

## Start infrastructure only

```bash
docker compose -f infra/docker/docker-compose.yml up postgres redis
```

## Start full baseline stack

```bash
docker compose -f infra/docker/docker-compose.yml up
```

## Stop stack

```bash
docker compose -f infra/docker/docker-compose.yml down
```

## Notes

- In this environment, docker compose plugin was unavailable, so only YAML validation by visual inspection was completed.
- Service startup was smoke-tested through npm workspace scripts.
