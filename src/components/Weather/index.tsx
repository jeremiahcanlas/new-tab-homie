import type { WeatherData } from "../../types";

type WeatherProp = { weather: WeatherData | null | undefined };

const Weather = ({ weather }: WeatherProp) => {
  if (!weather) return;

  return (
    <h1>
      {weather.temperature}
      <span>{weather.unit}</span>
    </h1>
  );
};

export default Weather;
