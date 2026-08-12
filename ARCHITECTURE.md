# Architecture

## High-level flow
Citizen -> Report issue -> AI classification -> duplicate check -> department routing -> admin assignment -> worker resolution -> citizen verification -> XP/reputation/badges -> leaderboard

## Modules
- Citizen UI
- Admin UI
- Worker UI
- Gamification UI
- issueService
- workflowService
- aiClassifier
- duplicateDetector
- gamificationEngine
- notificationAdapter

## Data layer
- Supabase/Postgres-compatible persistence
- Storage for evidence attachments
- Realtime for live updates where available
- Leaflet + OpenStreetMap for map visualization

## AI contract
The AI classification layer should provide a consistent schema such as:

```json
{
  "category": "Pothole",
  "severity": "High",
  "confidence": 0.94,
  "department": "Roads",
  "reason": "Road-surface damage detected in the supplied evidence"
}
```

The UI and workflow logic must be resilient to mock or local deterministic responses.
