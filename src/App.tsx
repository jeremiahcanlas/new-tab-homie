import Clock from "./components/Clock";
import Greet from "./components/Greet";
import Location from "./components/Location";
import Quote from "./components/Quote";
import Weather from "./components/Weather";
import Menu from "./components/Menu";

import { useState } from "react";

import { GearIcon } from "./assets/vectors";

import { DashboardSettingsProvider } from "./context/DashboardSettingsContext";

type AppProps = {
  greetingMessage: string;
  quote?: { author: string; text: string } | null;
};

function App({ greetingMessage, quote }: AppProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DashboardSettingsProvider>
      <div className="h-screen flex flex-row overflow-hidden animate-fade-in">
        <div className="main-container">
          <Greet message={greetingMessage} />
          <Clock />

          {/*create standalone component that is dependent on coordinates TODO */}
          <div className="flex flex-col gap-2 border border-gray-300 rounded p-1.5 w-[min(80vw,220px)] shadow-md">
            <Weather />
            <Location />
          </div>

          <Quote quote={quote} />
        </div>

        <Menu isOpen={isOpen} />

        <div
          className="w-12 absolute right-12 bottom-10 hover:animate-spin"
          onClick={() => setIsOpen(!isOpen)}
        >
          <GearIcon />
        </div>
      </div>
    </DashboardSettingsProvider>
  );
}

export default App;
