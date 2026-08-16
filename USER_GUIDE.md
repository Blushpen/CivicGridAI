# CivicGrid AI User Guide

Welcome to CivicGrid AI — a civic issue reporting and resolution platform with AI-assisted classification, duplicate detection, admin and worker workflows, and gamified citizen engagement.

## Getting Started

### Launch the app

1. Open the project folder in VS Code.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Open your browser and go to:
   ```text
   http://localhost:3000
   ```

## Main Pages

### Home

The landing page provides quick links to the key sections of the platform:
- `Dashboard`
- `Report Issue`
- `Admin Dashboard`
- `Worker Dashboard`
- `Gamification & Leaderboard`

### Citizen Dashboard (`/dashboard`)

This is the citizen view where issue reporters can:
- see XP, reputation, and CivicCoins
- view active missions and progress
- review recent reports and their statuses
- preview leaderboard rankings

### Report Issue (`/report`)

Use this page to submit a new civic issue:
- select an issue category
- enter a location description
- provide latitude/longitude coordinates
- upload evidence if supported
- write a clear issue description
- submit the issue

The app will then:
- validate the report
- run AI classification for category and routing
- check for possible duplicates
- create a shared issue record

### Admin Dashboard (`/admin`)

Admin users can:
- review the issue queue
- inspect current issue status and severity
- assign issues to workers
- track progress across the team

This page is intended to show the same issue set that citizens create, making it easy to manage back-office workflow.

### Worker Dashboard (`/worker`)

Worker users can:
- view assigned issues
- update issue status to `In Progress`
- mark issues as resolved
- track their active workload

### Gamification & Leaderboard (`/gamification`)

This page highlights citizen engagement metrics:
- XP and reputation totals
- earned badges and milestones
- leaderboard rankings
- issue report counts and verification stats

## Recommended Demo Flow

1. Open the Citizen Dashboard.
2. Go to `Report Issue`.
3. Choose `Pothole`.
4. Fill in location details and description.
5. Submit the issue.
6. Confirm the app shows classification or duplicate feedback.
7. Open the Admin Dashboard.
8. Find the new issue in the issue queue.
9. Assign it to a worker.
10. Open the Worker Dashboard.
11. Confirm the same issue appears in the worker queue.
12. Mark it `In Progress` and then `Resolved`.
13. Open the Gamification page.
14. Watch XP, reputation, badge, and leaderboard updates.

## What Works in the MVP

- Citizen issue reporting and validation
- AI classification mock workflow
- duplicate detection logic
- shared issue tracking and detail pages
- admin assignment and worker task status updates
- gamification metrics, badges, and leaderboard view

## Notes for Users

- The current demo uses in-memory/mock state for issues and workflows.
- This is a prototype experience meant to demonstrate the end-to-end civic issue flow.
- Use the dashboard navigation to move between citizen, admin, worker, and gamification views.

## Troubleshooting

- If a page does not load, verify the development server is running at `http://localhost:3000`.
- If the app does not start, stop the terminal and run:
  ```bash
  npm run dev
  ```
- If the issue does not appear on Admin or Worker pages, refresh the browser or restart the app to ensure the demo state is consistent.

## Helpful Commands

```bash
npm install
npm run build
npm run dev
```

Enjoy exploring CivicGrid AI and demonstrating the end-to-end civic issue flow!