import { useEffect, useState } from "react";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";

type Prop = {
  isOpen: boolean;
};

const Menu = ({ isOpen }: Prop) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  const { unit, setUnit, username, setUsername, clockFormat, setClockFormat } =
    useDashboardSettings();

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
        " bg-text-dark w-[25%] p-1 flex flex-col gap-2"
      }
      onAnimationEnd={handleAnimationEnd}
    >
      <h1>Settings</h1>

      <div>
        <label className="block mb-1" htmlFor="username">
          <p> Username:</p>
        </label>
        <input
          id="username"
          className="bg-white p-1"
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
    </div>
  );
};

export default Menu;
