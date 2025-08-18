import Clock from "./components/Clock";
import Greet from "./components/Greet";
import Location from "./components/Location";
import Quote from "./components/Quote";
import Weather from "./components/Weather";
import Menu from "./components/Menu";

import { useState } from "react";

import { GearIcon } from "./assets/vectors";

import { DashboardSettingsProvider } from "./context/DashboardSettingsContext";
import { useWeather } from "./hooks/weather";
import { useLocation } from "./hooks/location";

type AppProps = {
  greetingMessage: string;
  quote?: { author: string; text: string } | null;
};

const GearButton = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): React.JSX.Element => (
  <div
    className="w-12 absolute right-12 bottom-10 hover:animate-spin"
    onClick={() => setIsOpen(!isOpen)}
  >
    <GearIcon />
  </div>
);

const Forecast = (): React.JSX.Element => {
  const {
    loading: weatherLoading,
    weather,
    error: weatherError,
  } = useWeather();
  const {
    loading: locationLoading,
    location,
    error: locationError,
  } = useLocation();

  if (locationLoading || weatherLoading || !weather || !location) return <></>;

  return (
    <div className="flex flex-col gap-2 border border-gray-300 rounded p-1.5 w-[min(80vw,220px)] shadow-md animate-slide-in-right">
      <Weather weather={weather} error={weatherError} />
      <Location location={location} error={locationError} />
    </div>
  );
};

const Dashboard = ({ greetingMessage, quote }: AppProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen flex flex-row overflow-hidden animate-fade-in">
      <div className="main-container">
        <Greet message={greetingMessage} />
        <Clock />
        <Forecast />
        <Quote quote={quote} />
      </div>
      <Menu isOpen={isOpen} />
      <GearButton isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

function App(props: AppProps) {
  return (
    <DashboardSettingsProvider>
      <Dashboard {...props} />
    </DashboardSettingsProvider>
  );
}

export default App;
