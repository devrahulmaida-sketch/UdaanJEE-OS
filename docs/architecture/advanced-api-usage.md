# Advanced API Usage

## API Gateway

### Get feature catalog

```bash
curl -s http://localhost:4000/api/v1/features
```

### Generate adaptive plan

```bash
curl -s -X POST http://localhost:4000/api/v1/plans/generate \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "balanced",
    "targetExam": "JEE Main + Advanced",
    "dailyHours": 7,
    "hasBacklog": true,
    "weakTopics": ["Kinematics", "Quadratic Equations"]
  }'
```

## Learning Service

```bash
curl -s "http://localhost:4002/v1/topics/recommended?studentId=demo-student-1&limit=4"
```

## Planner Service

```bash
curl -s -X POST http://localhost:4001/v1/plans/rebalance \
  -H "Content-Type: application/json" \
  -d '{
    "track": "coaching-heavy",
    "dailyHours": 8,
    "backlogHours": 6,
    "newBacklogHours": 2,
    "burnoutRisk": 0.58,
    "weakTopics": ["phy-kinematics", "math-quadratic"]
  }'
```

## Assessment Service

```bash
curl -s -X POST http://localhost:4003/v1/tests/score \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "q-phy-1": 2,
      "q-math-1": 3,
      "q-chem-1": 3,
      "q-phy-2": 0,
      "q-math-2": 2
    }
  }'
```

## Analytics Service

```bash
curl -s http://localhost:4004/v1/students/demo-student-1/interventions
```
