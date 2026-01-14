import type { WeatherData } from "../../types";
import {
  SunnyIcon,
  CloudyIcon,
  FogIcon,
  RainIcon,
  SnowIcon,
  ThunderstormIcon,
  PartlyCloudyMoonIcon,
  PartlyCloudySunIcon,
  MoonIcon,
} from "../../assets/vectors";

type WeatherProps = {
  weather: WeatherData;
  error?: string | null;
};

const getWeatherIcon = (weatherCode: string) => {
  const code = parseInt(weatherCode);
  const hour = new Date().getHours();
  const isDaytime = hour >= 5 && hour < 17;

  // Clear sky
  if (code === 0) return isDaytime ? <SunnyIcon /> : <MoonIcon />;

  // Mainly clear, Partly cloudy
  if (code === 1 || code === 2) {
    return isDaytime ? <PartlyCloudySunIcon /> : <PartlyCloudyMoonIcon />;
  }

  // Overcast
  if (code === 3) return <CloudyIcon />;

  // Fog
  if (code === 45 || code === 48) return <FogIcon />;

  // Rain (drizzle, rain, freezing rain, showers)
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return <RainIcon />;
  }

  // Snow
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return <SnowIcon />;
  }

  // Thunderstorm
  if (code >= 95 && code <= 99) return <ThunderstormIcon />;

  // Default to cloudy
  return <CloudyIcon />;
};

const Weather = (props: WeatherProps): React.JSX.Element => {
  const { weather, error } = props;
  const { temperature, weatherStatus, feelsLike, weatherCode } = weather;

  if (error)
    return (
      <p className="border rounded border-gray-300 px-1 py-1.5">
        Error retrieving weather data.
      </p>
    );

  return (
    <div className="flex flex-row place-content-between">
      <div>
        <div className="flex flex-row items-center gap-2">
          <div className="w-[min(30vw,1.8em)] h-[min(30vw,1.8em)] flex items-center justify-center">
            {getWeatherIcon(weatherCode)}
          </div>
          <h1 className="leading-none font-bold text-[min(30vw,1.8em)] ">
            {temperature}&deg;
          </h1>
        </div>

        <h2 className="font-semibold mt-1.5">{weatherStatus}</h2>
      </div>

      <div>
        <p className="inline-block font-normal text-[0.9em] mr-1 align-top leading-none">
          feels
        </p>
        <h2 className="inline-block text-md font-semibold leading-none align-top">
          {feelsLike}&deg;
        </h2>
      </div>
    </div>
  );
};

export default Weather;
