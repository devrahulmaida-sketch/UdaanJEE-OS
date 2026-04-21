# Data Model Overview

## Primary entities

- `users` (student, parent, mentor, admin)
- `student_profiles`
- `study_plans`
- `study_sessions`
- `topics`
- `topic_progress`
- `tests`
- `test_attempts`
- `question_attempts`
- `doubts`
- `notifications`

## Key relationships

- One `users` record maps to one `student_profiles` for student role.
- One student has many `study_plans`, each containing many `study_sessions`.
- `topics` form a directed acyclic prerequisite graph.
- `test_attempts` and `question_attempts` drive analytics and weak-area detection.
