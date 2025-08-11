import type { WeatherData } from "../../types";

type WeatherProp = { weather: WeatherData | null | undefined };

const Weather = ({ weather }: WeatherProp) => {
  if (!weather) return;

  return (
    <div className="flex flex-row place-content-between">
      <div>
        <h1 className="leading-none">
          {weather.temperature}
          <span className="text-xs align-top">{weather.unit}</span>
        </h1>
        <h2>{weather.weatherStatus}</h2>
      </div>

      <div>
        <p className="inline-block mr-1 align-top leading-none">feels</p>
        <h2 className="inline-block text-md font-semibold leading-none align-top">
          {weather.feelsLike}
          <span className="text-xs align-top">{weather.unit.slice(0, 1)}</span>
        </h2>
      </div>
    </div>
  );
};

export default Weather;
