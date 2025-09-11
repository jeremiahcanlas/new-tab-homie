import { useEffect, useState } from "react";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";
// import useGoogleSuggestions from "../../hooks/search/useGoogleSuggestions";

const Search = (): React.JSX.Element => {
  const { isSearchToggled } = useDashboardSettings();
  // const { suggestions } = useGoogleSuggestions(query);
  const [query, setQuery] = useState("");
  const [shouldRender, setShouldRender] = useState(isSearchToggled);

  useEffect(() => {
    if (isSearchToggled) setShouldRender(true);
  }, [isSearchToggled]);

  const handleAnimationEnd = () => {
    if (!isSearchToggled) setShouldRender(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const baseUrl = "https://www.google.com/search";

    window.location.href = `${baseUrl}?q=${encodeURIComponent(query)}`;
  };

  // const handleSuggestionClick = (suggestion: string) => {
  //   setQuery(suggestion);
  //   const baseUrl = "https://www.google.com/search";

  //   window.location.href = `${baseUrl}?q=${encodeURIComponent(suggestion)}`;
  // };

  if (!shouldRender) return <></>;

  return (
    <form
      onSubmit={handleSubmit}
      className={
        "relative max-w-md mt-5 shadow-outline" +
        (isSearchToggled
          ? " animate-slide-in-right"
          : " animate-slide-out-right")
      }
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-l"
        />
        <button
          type="submit"
          className="px-4 py-2 border border-gray-300 border-l-0  text-current rounded-r hover:bg-gray-700"
        >
          Search
        </button>
      </div>

      {/* TODO suggestions has CORS issue upon building */}
      {/* {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-background-dark-secondary border mt-1 rounded shadow">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleSuggestionClick(s)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {s}
            </li>
          ))}
        </ul>
      )} */}
    </form>
  );
};

export default Search;
