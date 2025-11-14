# Homie Dashboard

A fast, minimalist new tab dashboard built with React + Vite + TypeScript and Tailwind CSS. Transform your browser's new tab into a personalized workspace with intelligent greetings, real-time weather, and daily motivation.

---

## Features

- **Smart Greetings** - Personalized time-based messages
- **Real-time Weather** - Current weather conditions and temperature based on location
- **Location Display** - Shows your current city and region
- **Daily Motivation** - Random motivational quotes
- **Persistent Preferences** - Your settings are saved locally across sessions
- **Responsive Design** - Optimized for various desktop screen sizes
- **Lightning Fast** - Built with Vite for instant loading and optimal performance

---

## Why Homie Dashboard?

Replace your cluttered new tab page with a clean, functional dashboard that provides everything you need at a glance. No distractions, just the essentials presented beautifully.

---

## Tech Stack

| Technology       | Purpose                          |
| ---------------- | -------------------------------- |
| **React**        | Component-based UI library       |
| **Vite**         | Fast build tool and dev server   |
| **TypeScript**   | Type-safe JavaScript development |
| **Tailwind CSS** | Utility-first CSS framework      |

---

## Getting Started

### Prerequisites

Ensure you have **Node.js v20.19.4** installed:

```bash
node -v
```

If you need to install or switch Node.js versions, use nvm:

```bash
nvm install 20.19.4
nvm use 20.19.4
```

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/jeremiahcanlas/new-tab-homie.git
   cd new-tab-homie
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or if you prefer yarn
   yarn install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   Open your browser and navigate to `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

---

## Usage

### Setting as Default New Tab

You can download it [here](https://chromewebstore.google.com/detail/new-tab-homie/fompnhapcdbjbekdabkplcddnmmapbko?authuser=0&hl=en)

### Configuration

The dashboard automatically detects your location for weather and greetings. On first visit, you may be prompted to allow location access for the best experience.

---

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run vitest for testing
```

### Project Structure

```
homie-dashboard/
├── src/
│   ├── components/    # Dashboard components
│   ├── context/       # React Context providers for state management
│   ├── data/          # Static data files and constants
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API calls and external service integrations
│   ├── test/          # Test setup
│   ├── types/         # TypeScript type definitions
│   └── App.tsx        # Main application component
├── public/            # Static assets
└── dist/              # Production build output
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/some-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/some-feature`)
5. Open a Pull Request

---

## Acknowledgments

- Weather data provided by [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs)
- Reverse geolocation provided by [Nominatim API](https://nominatim.org/)
- SVGS from [SVGRepo](https://www.svgrepo.com/)

---

## Support

If you have any questions or run into issues, please [open an issue](https://github.com/jeremiahcanlas/new-tab-homie/issues) on GitHub.
