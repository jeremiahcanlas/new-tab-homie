import { useCallback, useEffect, useState } from "react";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";
import type { WeatherData } from "../../types";
import weatherService from "../../services/weather/weatherService";
import coordinatesService from "../../services/coordinates/coordinatesService";

const Weather = (): React.JSX.Element => {
  const { unit } = useDashboardSettings();

  // turn this into a custom hook TODO
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchWeather = useCallback(async () => {
    const coords = await coordinatesService.getCoords();

    if (!coords) return;

    const weatherData = await weatherService.getWeather(coords, unit);

    setWeather(weatherData);
  }, [unit]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  if (!weather) return <div></div>;

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
