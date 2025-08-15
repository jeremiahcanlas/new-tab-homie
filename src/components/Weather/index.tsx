import { useWeather } from "../../hooks/weather";

const Weather = (): React.JSX.Element => {
  const { weather, loading, error } = useWeather();

  if (error) return <div>Error retrieving weather data.</div>;

  if (loading || !weather) return <div>loading...</div>;

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
