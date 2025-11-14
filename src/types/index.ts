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
  username: string | undefined;
  setUsername: (username: string) => void;
  isCelsius: boolean;
  toggleUseCelsius: (isCelsius: boolean) => void;
  twelveHourMode: boolean;
  setTwelveHourMode: (twelveHourMode: boolean) => void;
  darkToggled: boolean;
  setDarkToggled: (darkToggled: boolean) => void;
  isSearchToggled: boolean;
  toggleSearch: (isSearchToggled: boolean) => void;
  isQuoteToggled: boolean;
  toggleQuote: (isQuoteToggled: boolean) => void;
}
