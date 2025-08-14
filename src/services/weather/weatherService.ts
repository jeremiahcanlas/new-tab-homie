import type WeatherProvider from "./WeatherProvider";
import weatherType from "../../data/weatherType.json";

const weatherService: WeatherProvider = {
  async getWeather(geolocation, unit) {
    if (!geolocation) {
      geolocation = {
        lat: 43.65107,
        lon: -79.347015,
      };
    }

    const { lat, lon } = geolocation;

    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&temperature_unit=${unit}&current_weather=true&hourly=apparent_temperature`
      );

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();

      const { current_weather, current_weather_units, hourly } = data;

      const weatherCode = JSON.stringify(current_weather.weathercode);

      const weatherStatus =
        weatherType[weatherCode as keyof typeof weatherType];

      const feelsLike = Math.round(
        hourly.apparent_temperature[
          hourly.time.indexOf(current_weather.time.slice(0, 13) + ":00")
        ]
      );

      const filteredData = {
        temperature: Math.round(current_weather.temperature),
        unit: current_weather_units.temperature,
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
