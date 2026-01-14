import type WeatherProvider from "./WeatherProvider";
import weatherType from "../../data/weatherType.json";

const weatherService: WeatherProvider = {
  async getCurrentWeather(geolocation, isCelsius) {
    if (!geolocation) {
      geolocation = {
        lat: 43.65107,
        lon: -79.347015,
      };
    }

    const { lat, lon } = geolocation;

    try {
      const unit = isCelsius ? "celsius" : "fahrenheit";

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&temperature_unit=${unit}&current=temperature_2m,apparent_temperature,weather_code`
      );

      if (!res.ok) {
        throw new Error(`Weather API Error: ${res.status}`);
      }

      const data = await res.json();

      const { weather_code, apparent_temperature, temperature_2m } =
        data.current;

      const weatherCode = JSON.stringify(weather_code);

      const weatherStatus =
        weatherType[weatherCode as keyof typeof weatherType];

      const temperature = Math.round(temperature_2m);

      const feelsLike = Math.round(apparent_temperature);

      const filteredData = {
        weatherCode,
        temperature,
        weatherStatus,
        feelsLike,
      };

      return filteredData;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default weatherService;
