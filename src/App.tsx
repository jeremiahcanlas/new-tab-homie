import Clock from "./components/Clock";
import Greet from "./components/Greet";

import Location from "./components/Location";
import Weather from "./components/Weather";
import type { LocationData, WeatherData } from "./types";

type AppProps = {
  greetingMessage: string;
  location: LocationData;
  weather?: WeatherData | null;
};

function App({ greetingMessage, location, weather }: AppProps) {
  return (
    <div className="main-container">
      <Greet message={greetingMessage} />
      <Clock />
      <Weather weather={weather} />
      <Location location={location} />
    </div>
  );
}

export default App;
