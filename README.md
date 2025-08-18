# Demo Weather App

A modern weather application built with Next.js, featuring real-time weather data, forecasts, and historical weather information.

## Features

- 🌤️ Current weather conditions
- 📅 7-day weather forecast
- 🕐 Hourly weather updates
- 📍 Location search by city name
- 🌡️ Temperature, humidity, wind, and pressure data
- 📱 Responsive design with modern UI components

## API Integration

This app uses the [Weatherstack API](https://weatherstack.com/documentation) to provide accurate weather data. The API offers:

- Real-time current weather
- Up to 14-day weather forecasts
- Historical weather data
- Global coverage with multiple data sources

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd demo-weather-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your Weatherstack API key:
   - Sign up for a free account at [weatherstack.com](https://weatherstack.com)
   - Get your API access key from the dashboard
   - Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WEATHERSTACK_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Plan Limitations

**Free Plan:**
- 1,000 API calls per month
- Current weather data only
- No forecast or historical data

**Paid Plans:**
- Standard ($9.99/month): 50,000 calls, 3-day forecast
- Professional ($49.99/month): 300,000 calls, 7-day forecast
- Business ($99.99/month): 1,000,000 calls, 14-day forecast

## Project Structure

```
demo-weather-app/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── common/           # Shared components
│   ├── layout/           # Layout components
│   ├── ui/               # UI components (shadcn/ui)
│   └── weather/          # Weather-specific components
├── contexts/             # React contexts
├── lib/                  # Utility functions and API
└── public/               # Static assets
```

## Key Components

- **CurrentWeather**: Displays current weather conditions
- **SevenDayForecast**: Shows 7-day weather forecast
- **HourlyForecast**: Hourly weather updates for today
- **AirConditions**: Detailed air quality metrics
- **LocationSearch**: City search functionality

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Weather API**: Weatherstack

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [Weatherstack API](https://weatherstack.com/documentation) - weather data API documentation

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
