# Demo Weather App

A modern, responsive weather application built with Next.js 15, React 19, and TypeScript. Features real-time weather data, location search, and a beautiful dark/light theme toggle.

🌐 **Live Demo**: [https://demo-weather-app-wine.vercel.app/](https://demo-weather-app-wine.vercel.app/)

## ✨ Features

- **Real-time Weather Data**: Current conditions, hourly forecasts, and 7-day predictions
- **Location Search**: Search for cities worldwide with autocomplete suggestions
- **Historical Weather**: View past weather data for any location
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Beautiful theme switching with system preference detection
- **Interactive Charts**: Visualize temperature and precipitation trends
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand + TanStack Query (React Query)
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion
- **Build Tool**: Turbopack for fast development
- **Testing**: Jest with React Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd demo-weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
demo-weather-app/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
│   ├── common/           # Shared components (ThemeToggle, LoadingSpinner)
│   ├── layout/           # Layout components
│   ├── ui/               # Base UI components (Button, Card, etc.)
│   └── weather/          # Weather-specific components
├── stores/                # Zustand state stores (theme, weather)
├── contexts/              # Legacy Context API (being migrated to Zustand)
├── lib/                   # Utility functions and API services
├── public/                # Static assets
└── __tests__/             # Test files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## 🌟 Key Features Explained

### State Management
- **Zustand**: Lightweight client state management for UI state, theme preferences, and local data
- **TanStack Query**: Server state management with built-in caching, background updates, and error handling
- **Migration in Progress**: Currently migrating from React Context API to Zustand for better performance and developer experience

### Weather Data
- **Open-Meteo API**: Free, reliable weather data source with no API key required
- **Real-time Updates**: Automatic data refresh and intelligent caching
- **Historical Data**: Access to past weather information
- **Location Services**: Geocoding and reverse geocoding via OpenStreetMap

### Performance Optimizations
- **Automatic Caching**: TanStack Query handles data caching intelligently
- **Selective Re-renders**: Zustand only re-renders components that use specific state slices
- **Background Updates**: Weather data updates automatically in the background
- **Optimistic Updates**: UI updates immediately while data fetches

## 🧪 Testing

The app includes comprehensive testing with Jest and React Testing Library:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🎨 Customization

### Themes
- Customize colors in `tailwind.config.ts`
- Modify theme logic in `stores/theme-store.ts`
- Add new themes by extending the Theme type

### Weather Data
- Modify API endpoints in `lib/weather-api.ts`
- Adjust caching strategies in `lib/query-client.ts` (if using TanStack Query)
- Customize data transformation in `lib/weather-utils.ts`

## 📱 Responsive Design

The app is fully responsive with breakpoints for:
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large screens: 1280px+

## 🔒 Environment Variables

No API keys required - the app uses the free Open-Meteo API and OpenStreetMap services.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for free weather data
- [OpenStreetMap](https://www.openstreetmap.org/) for location services
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Zustand](https://github.com/pmndrs/zustand) for lightweight state management
- [TanStack Query](https://tanstack.com/query) for server state management
