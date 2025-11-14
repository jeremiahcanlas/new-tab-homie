import type { CoordsData, WeatherData } from "../../types";

export default interface WeatherProvider {
  getCurrentWeather(
    geolocation: CoordsData | null,
    isCelsius: boolean
  ): Promise<WeatherData | null>;
}
