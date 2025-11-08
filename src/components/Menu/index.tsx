import { useDashboardSettings } from "../../context/DashboardSettingsContext";

type Prop = {
  isOpen: boolean;
};

const Menu = ({ isOpen }: Prop) => {
  const {
    unit,
    setUnit,
    username,
    setUsername,
    clockFormat,
    setClockFormat,
    darkToggled,
    setDarkToggled,
    isSearchToggled,
    toggleSearch,
    isQuoteToggled,
    toggleQuote,
  } = useDashboardSettings();

  return (
    <div
      className={"menu-sidebar transition-smooth" + (isOpen ? " open" : "")}
      aria-hidden={!isOpen}
    >
      <div className="w-sm flex flex-col gap-2 p-2">
        <h1 className="font-bold text-[1.5em]">Dashboard Settings</h1>

        <div>
          <label className="inline-block mb-1 mr-2" htmlFor="username">
            <p> Username:</p>
          </label>
          <input
            id="username"
            className="bg-white dark:bg-gray-800 p-1.5 rounded"
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
            <p>dark mode</p>
            <input
              type="checkbox"
              name="darkToggle"
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
          </label>
        </div>

        <div>
          <label className="flex items-center align-middle gap-3">
            <p>show search</p>
            <input
              type="checkbox"
              name="searchToggle"
              checked={isSearchToggled}
              onChange={() => toggleSearch(!isSearchToggled)}
              className="sr-only peer"
            />
            <div className="w-9 h-4 bg-gray-500 duration-400 peer-checked:bg-gray-400 rounded-full relative transition-colors">
              <div
                className={`absolute left-1 top-1 w-2 h-2 bg-white rounded-[100%] duration-400 transition-transform  ${
                  isSearchToggled ? "translate-x-5" : ""
                }`}
              />
            </div>
          </label>
        </div>

        <div>
          <label className="flex items-center align-middle gap-3">
            <p>show quote</p>
            <input
              type="checkbox"
              name="searchToggle"
              checked={isQuoteToggled}
              onChange={() => toggleQuote(!isQuoteToggled)}
              className="sr-only peer"
            />
            <div className="w-9 h-4 bg-gray-500 duration-400 peer-checked:bg-gray-400 rounded-full relative transition-colors">
              <div
                className={`absolute left-1 top-1 w-2 h-2 bg-white rounded-[100%] duration-400 transition-transform  ${
                  isQuoteToggled ? "translate-x-5" : ""
                }`}
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Menu;
