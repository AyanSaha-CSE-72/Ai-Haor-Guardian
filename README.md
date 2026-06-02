## AI Haor Guardian

This app now includes three global AI features powered by Gemini:

1. Weather prediction
2. Fish insight
3. Storm alert AI

### Setup

Create a `.env.local` file in the project root with one of these keys:

```bash
GEMINI_API_KEY=your_api_key_here
```

or

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

Then run:

```bash
npm install
npm run dev
```

### How it works

- Open the dashboard.
- Enter any wetland, delta, river basin, or coastal location.
- Gemini returns structured AI output for weather, fish, and storm conditions.
