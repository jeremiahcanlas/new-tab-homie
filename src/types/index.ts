export type CoordsData = { lat: number; lon: number };

export type LocationData = {
  city: string;
  stateProvince: string;
  country?: string;
  locationDisabled: boolean;
};

export type WeatherData = {
  temperature: number;
  unit: string;
  weatherStatus: string;
  feelsLike: number;
};
