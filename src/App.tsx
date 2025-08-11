import Clock from "./components/Clock";
import Greet from "./components/Greet";

import Location from "./components/Location";
import Quote from "./components/Quote";
import Weather from "./components/Weather";
import type { LocationData, WeatherData } from "./types";

type AppProps = {
  greetingMessage: string;
  location: LocationData;
  weather?: WeatherData | null;
  quote?: { author: string; text: string } | null;
};

function App({ greetingMessage, location, weather, quote }: AppProps) {
  return (
    <div className="main-container">
      <Greet message={greetingMessage} />
      <Clock />
      <div className="flex flex-col gap-2 border border-gray-300 rounded p-1.5 w-[min(80vw,220px)] shadow-md">
        <Weather weather={weather} />
        <Location location={location} />
      </div>

      <Quote quote={quote} />
    </div>
  );
}

export default App;
