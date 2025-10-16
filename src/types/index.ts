export type CoordsData = { lat: number; lon: number };

export type LocationData = {
  city: string;
  stateProvince: string;
  country?: string;
  locationDisabled: boolean;
};

export type WeatherData = {
  temperature: number;
  weatherStatus: string;
  feelsLike: number;
};

export type QuoteData = {
  author: string;
  text: string;
};

export interface DashboardSettingsContextType {
  unit: "celsius" | "fahrenheit";
  setUnit: (unit: "celsius" | "fahrenheit") => void;
  username: string | undefined;
  setUsername: (username: string) => void;
  clockFormat: "12" | "24";
  setClockFormat: (clockFormat: "12" | "24") => void;
  darkToggled: boolean;
  setDarkToggled: (darkToggled: boolean) => void;
  isSearchToggled: boolean;
  toggleSearch: (isSearchToggled: boolean) => void;
}
