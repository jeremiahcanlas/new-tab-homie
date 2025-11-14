import { useDashboardSettings } from "../../context/DashboardSettingsContext";

type Prop = {
  isOpen: boolean;
};

const Menu = ({ isOpen }: Prop) => {
  const {
    username,
    setUsername,
    isCelsius,
    toggleUseCelsius,
    twelveHourMode,
    setTwelveHourMode,
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
      <div className="w-sm flex flex-col gap-4 p-4">
        <div className="w-fit">
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

        <div className="border-1 shadow-outline w-[60%] rounded-sm p-2 flex flex-col gap-1">
          <h1 className="font-bold">Preferences:</h1>
          <div>
            <label className="flex items-center align-middle gap-3">
              <p className="mr-auto">12-hr time</p>
              <input
                type="checkbox"
                name="timeToggle"
                checked={twelveHourMode}
                onChange={() => setTwelveHourMode(!twelveHourMode)}
                className="sr-only peer"
              />
              <div className="w-9 h-4 bg-gray-500 duration-400 peer-checked:bg-gray-400 rounded-full relative transition-colors">
                <div
                  className={`absolute left-1 top-1 w-2 h-2 bg-white rounded-[100%] duration-400 transition-transform  ${
                    twelveHourMode ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </label>
          </div>
          <div>
            <label className="flex items-center align-middle gap-3">
              <p className="mr-auto">use celsius</p>
              <input
                type="checkbox"
                name="weatherToggle"
                checked={isCelsius}
                onChange={() => toggleUseCelsius(!isCelsius)}
                className="sr-only peer"
              />
              <div className="w-9 h-4 bg-gray-500 duration-400 peer-checked:bg-gray-400 rounded-full relative transition-colors">
                <div
                  className={`absolute left-1 top-1 w-2 h-2 bg-white rounded-[100%] duration-400 transition-transform  ${
                    isCelsius ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </label>
          </div>
          <h1 className="font-bold mt-2">Display:</h1>
          <div>
            <label className="flex items-center align-middle gap-3">
              <p className="mr-auto">dark mode</p>
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
              <p className="mr-auto">show search</p>
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
              <p className="mr-auto">show quote</p>
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
    </div>
  );
};

export default Menu;
