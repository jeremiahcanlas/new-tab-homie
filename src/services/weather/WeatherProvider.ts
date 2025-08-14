import type { CoordsData, WeatherData } from "../../types";

export default interface WeatherProvider {
  getWeather(
    geolocation: CoordsData | null,
    unit: string | null
  ): Promise<WeatherData | null>;
}
