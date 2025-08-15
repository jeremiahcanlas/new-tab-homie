import { useWeather } from "../../hooks/weather";

const Weather = (): React.JSX.Element => {
  const { weather, loading, error } = useWeather();

  if (error) return <p>Error retrieving weather data.</p>;

  if (loading || !weather) return <p>loading...</p>;

  return (
    <div className="flex flex-row place-content-between">
      <div>
        <h1 className="leading-none">{weather.temperature}&deg;</h1>
        <h2>{weather.weatherStatus}</h2>
      </div>

      <div>
        <p className="inline-block mr-1 align-top leading-none">feels</p>
        <h2 className="inline-block text-md font-semibold leading-none align-top">
          {weather.feelsLike}&deg;
        </h2>
      </div>
    </div>
  );
};

export default Weather;
