# CivicGrid AI

CivicGrid AI is a civic issue reporting and resolution platform that combines AI-assisted triage, transparent workflow management, and a gamified reputation loop to improve the citizen-to-authority feedback cycle.

## Project brief
This repository is bootstrapped from the CivicGrid AI Master AI Context and LT HackFest Build Brief. The project goal is to deliver a polished 2-3 minute MVP demo that covers:

- citizen issue reporting
- AI classification and routing
- duplicate detection and issue prioritization
- admin and worker operations
- XP, reputation, badges, and leaderboards

## Stack
- Next.js + React + TypeScript
- Tailwind CSS
- Supabase-compatible backend/data layer
- Leaflet + OpenStreetMap for map visualization
- Provider-agnostic AI interface with deterministic fallback

## Local development
```bash
npm install
npm run dev
```

## Security notes
- Never commit secrets or environment files.
- Keep `.env` out of version control.
- Use a mock or local AI fallback in the demo path.
