# Weather App Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Weatherbit API Key
1. Go to [Weatherbit.io](https://www.weatherbit.io/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

### 3. Configure Environment Variables
1. Copy `.env.local` file (already created)
2. Replace `your_api_key_here` with your actual Weatherbit API key:
```env
NEXT_PUBLIC_WEATHERBIT_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_WEATHERBIT_BASE_URL=https://api.weatherbit.io/v2.0
```

### 4. Run the Development Server
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## API Endpoints Used

- **Current Weather**: `/current` - Get current weather conditions
- **Forecast**: `/forecast/daily` - Get 3-day weather forecast
- **Historical**: `/history/daily` - Get historical weather data

## API Rate Limits
- Free tier: 1000 calls per day
- Current weather: 1 call per request
- Forecast: 1 call per request
- Historical: 1 call per request

## Troubleshooting

### API Key Issues
- Ensure your API key is correctly set in `.env.local`
- Check that the key is active in your Weatherbit dashboard
- Verify you haven't exceeded daily limits

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### TypeScript Errors
- Run `npm run build` to check for type errors
- Ensure all imports are correct
- Check that environment variables are properly typed
