import type { WeatherData } from "../../types";

type WeatherProp = { weather: WeatherData | null | undefined };

const Weather = ({ weather }: WeatherProp) => {
  if (!weather) return;

  return (
    <div className="mb-1">
      <h1>
        {weather.temperature}
        <span>{weather.unit}</span>
      </h1>
      <p>{weather.weatherStatus}</p>
    </div>
  );
};

export default Weather;
