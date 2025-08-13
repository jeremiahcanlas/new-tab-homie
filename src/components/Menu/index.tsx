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
        " bg-text-dark w-[25%] p-1"
      }
      onAnimationEnd={handleAnimationEnd}
    >
      <h1>Settings</h1>

      <div>
        <label className="block mb-1" htmlFor="username">
          Username:
        </label>
        <input
          id="username"
          type="text"
          value={username}
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <span className="block mb-1">Clock Format:</span>
        <label className="mr-4">
          <input
            type="radio"
            value="12"
            checked={clockFormat === "12"}
            onChange={() => setClockFormat("12")}
            className="mr-1"
          />
          12-Hour
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="24"
            checked={clockFormat === "24"}
            onChange={() => setClockFormat("24")}
            className="mr-1"
          />
          24-Hour
        </label>
      </div>

      <div>
        <span className="block mb-1">Temperature Unit:</span>
        <label className="mr-4">
          <input
            type="radio"
            value="c"
            checked={unit === "celsius"}
            onChange={() => setUnit("celsius")}
            className="mr-1"
          />
          Celsius (°C)
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="f"
            checked={unit === "fahrenheit"}
            onChange={() => setUnit("fahrenheit")}
            className="mr-1"
          />
          Fahrenheit (°F)
        </label>
      </div>
    </div>
  );
};

export default Menu;
