import { useEffect, useState } from "react";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";

type Prop = {
  isOpen: boolean;
};

const Menu = ({ isOpen }: Prop) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  const {
    unit,
    setUnit,
    username,
    setUsername,
    clockFormat,
    setClockFormat,
    darkToggled,
    setDarkToggled,
  } = useDashboardSettings();

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={
        (isOpen ? "animate-slide-in-left" : "animate-slide-out-left") +
        " bg-text-dark dark:bg-text w-[25%] p-[20px] flex flex-col gap-2"
      }
      onAnimationEnd={handleAnimationEnd}
    >
      <h1>Dashboard Settings</h1>

      <div>
        <label className="block mb-1" htmlFor="username">
          <p> Username:</p>
        </label>
        <input
          id="username"
          className="bg-white text-text p-1"
          type="text"
          value={username}
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <p className="block mb-1">Clock Format:</p>
        <label className="mr-4">
          <input
            type="radio"
            value="12"
            checked={clockFormat === "12"}
            onChange={() => setClockFormat("12")}
            className="mr-1"
          />
          <p className="inline-block">12-hr</p>
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="24"
            checked={clockFormat === "24"}
            onChange={() => setClockFormat("24")}
            className="mr-1"
          />
          <p className="inline-block">24-hr</p>
        </label>
      </div>

      <div>
        <p className="block mb-1">Temperature Unit:</p>
        <label className="mr-4">
          <input
            type="radio"
            value="c"
            checked={unit === "celsius"}
            onChange={() => setUnit("celsius")}
            className="mr-1"
          />
          <p className="inline-block">°C</p>
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="f"
            checked={unit === "fahrenheit"}
            onChange={() => setUnit("fahrenheit")}
            className="mr-1"
          />
          <p className="inline-block">°F</p>
        </label>
      </div>

      <div>
        <label className="flex items-center align-middle gap-3">
          <input
            type="checkbox"
            name="featureToggle"
            checked={darkToggled}
            onChange={() => setDarkToggled(!darkToggled)}
            className="sr-only peer"
          />

          <div className="w-9 h-4 bg-gray-500 duration-400 peer-checked:bg-gray-400 rounded-full relative transition-colors">
            <div
              className={`absolute left-1 top-1 w-2 h-2 bg-white rounded-[100%] duration-400 transition-transform  ${
                darkToggled ? "translate-x-5" : ""
              }`}
            />
          </div>

          <p>toggle dark mode</p>
        </label>
      </div>
    </div>
  );
};

export default Menu;
