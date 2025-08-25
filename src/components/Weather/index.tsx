import type { WeatherData } from "../../types";

type WeatherProps = {
  weather: WeatherData;
  error?: string | null;
};

const Weather = (props: WeatherProps): React.JSX.Element => {
  const { weather, error } = props;
  const { temperature, weatherStatus, feelsLike } = weather;

  if (error)
    return (
      <p className="border rounded border-gray-300 px-1 py-1.5">
        Error retrieving weather data.
      </p>
    );

  return (
    <div className="flex flex-row place-content-between">
      <div>
        <h1 className="leading-none">{temperature}&deg;</h1>
        <h2>{weatherStatus}</h2>
      </div>

      <div>
        <p className="inline-block mr-1 align-top leading-none">feels</p>
        <h2 className="inline-block text-md font-semibold leading-none align-top">
          {feelsLike}&deg;
        </h2>
      </div>
    </div>
  );
};

export default Weather;
