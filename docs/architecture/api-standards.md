# API Standards

## Versioning
- Base path: `/api/v1`
- Breaking changes require new major route version

## Error format

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Human-readable explanation",
    "requestId": "trace-id"
  }
}
```

## Security
- Auth required by default
- Explicitly mark public endpoints
