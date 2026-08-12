# Setup Checklist

This repository is the CivicGrid AI hackathon MVP.

## Required steps

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy the example environment file
   ```bash
   cp .env.example .env
   ```
3. Configure local demo mode
   - Set `AI_PROVIDER=mock` in `.env`
4. Verify the project builds
   ```bash
   npm run build
   ```
5. Start the development server
   ```bash
   npm run dev
   ```
6. Open the app in the browser
   - `http://localhost:3000`

## Notes

- Do not commit `.env` or any secret values.
- For the hackathon demo, use the local/mock AI provider and deterministic fallback logic.
- The app should render the updated CivicGrid AI landing page with the setup checklist.
