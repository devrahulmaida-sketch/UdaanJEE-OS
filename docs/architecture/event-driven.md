# Event-Driven Architecture

## Core event channels
- `study.session.created`
- `study.session.completed`
- `test.attempt.submitted`
- `doubt.raised`
- `notification.dispatch.requested`

## Event contracts
- Versioned payload schema with backward compatibility
- Correlation ID required for each event
- Dead-letter queue for non-retriable failures

## Consumers
- Analytics service consumes study/test events
- AI service consumes progression and assessment events
- Notification service consumes reminder and risk events
