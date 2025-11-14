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
import Search from "./components/Search";

const GearButton = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): React.JSX.Element => (
  <div
    className="w-12 absolute right-12 bottom-10 hover:animate-spin animate-once cursor-pointer"
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

  if (locationLoading || weatherLoading || !weather || !location)
    return <div className="h-[97.41px]" />;

  return (
    <div className="flex flex-col gap-2 border border-gray-300 rounded p-1.5 w-[min(80vw,220px)] shadow-outline animate-slide-in-right">
      <Weather weather={weather} error={weatherError} />
      <Location location={location} error={locationError} />
    </div>
  );
};

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dashboard-container">
      <div
        className="main-container"
        onClick={() => isOpen && setIsOpen(false)}
      >
        <Greet />
        <Clock />
        <Forecast />
        <Search />
        <Quote />
      </div>
      <Menu isOpen={isOpen} />
      <GearButton isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

function App() {
  return (
    <DashboardSettingsProvider>
      <Dashboard />
    </DashboardSettingsProvider>
  );
}

export default App;
