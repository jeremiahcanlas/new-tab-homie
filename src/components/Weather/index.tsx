import { useEffect, useState } from "react";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";
import type { WeatherData } from "../../types";
import { getWeather } from "../../utils/propUtils";

type WeatherProp = { weather: WeatherData | null | undefined };

const Weather = ({ weather }: WeatherProp) => {
  const { unit } = useDashboardSettings();

  const [updatedWeather, setUpdatedWeather] = useState(weather);

  useEffect(() => {
    const fetchWeather = async () => {
      const coords = localStorage.getItem("user_coords");

      if (coords) {
        const w = await getWeather(coords, unit);

        if (w) setUpdatedWeather(w);
      }
    };

    if (unit !== localStorage.getItem("temp_unit")) {
      fetchWeather();
    }
  }, [unit]);

  if (!updatedWeather) return;

  return (
    <div className="flex flex-row place-content-between">
      <div>
        <h1 className="leading-none">
          {updatedWeather.temperature}
          <span className="text-xs align-top">{updatedWeather.unit}</span>
        </h1>
        <h2>{updatedWeather.weatherStatus}</h2>
      </div>

      <div>
        <p className="inline-block mr-1 align-top leading-none">feels</p>
        <h2 className="inline-block text-md font-semibold leading-none align-top">
          {updatedWeather.feelsLike}
          <span className="text-xs align-top">
            {updatedWeather.unit.slice(0, 1)}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default Weather;
