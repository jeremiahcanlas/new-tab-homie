import type { CoordsData, WeatherData } from "../../types";

export default interface WeatherProvider {
  getCurrentWeather(
    geolocation: CoordsData | null,
    unit: string | null
  ): Promise<WeatherData | null>;
}
