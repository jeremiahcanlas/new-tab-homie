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
      <Weather weather={weather} />
      <Location location={location} />
      <Quote quote={quote} />
    </div>
  );
}

export default App;
