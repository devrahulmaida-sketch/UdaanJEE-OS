# UdaanJEE OS

Open source, free forever, AI-assisted learning operating system for JEE aspirants from Class 11 onward, designed to unify school, coaching, and self-study in one platform.

## Mission

Provide every learner with a professional-grade, zero-cost preparation ecosystem that supports planning, learning, testing, mentorship, and well-being without ads, paywalls, or data exploitation.

## Monorepo Layout

- `apps/web` - Student and mentor web app (Next.js)
- `apps/mobile` - Mobile client (React Native / Expo)
- `apps/admin` - Operations and moderation portal
- `services/*` - Core backend and AI services
- `packages/*` - Shared UI, config, types, and design tokens
- `infra/*` - Docker, Kubernetes, and Terraform deployment assets
- `docs/*` - Architecture, governance, product specs, and deployment guides

## Principles

- Free forever for students
- Open source governance and transparent roadmap
- Privacy-first architecture and no data selling
- Offline-friendly and low-bandwidth capable
- Hindi-first with multilingual expansion

## Getting Started

This repository is scaffolded for enterprise-grade collaborative development.

1. Read `docs/product/vision.md`
2. Read `docs/architecture/system-overview.md`
3. Read `docs/governance/open-source-model.md`
4. Follow `CONTRIBUTING.md`

## Local Development

- Install Node.js 20+
- Run `npm install`
- Start services:
  - `npm run dev:api-gateway`
  - `npm run dev:planner`
  - `npm run dev:learning`
  - `npm run dev:assessment`
  - `npm run dev:analytics`
  - `npm run dev:ai`
  - `npm run dev:notification`

## Docker Stack

Use local infrastructure and core service containers:

- `docker compose -f infra/docker/docker-compose.yml up`
- Full guide: `docs/deployment/docker-compose.md`

## License

AGPL-3.0
