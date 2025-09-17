import { useEffect, useState } from "react";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";

export const useSearch = () => {
  const { isSearchToggled } = useDashboardSettings();

  const [query, setQuery] = useState("");
  const [shouldRender, setShouldRender] = useState(isSearchToggled);

  useEffect(() => {
    if (isSearchToggled) setShouldRender(true);
  }, [isSearchToggled]);

  const handleAnimationEnd = () => {
    if (!isSearchToggled) setShouldRender(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      if (chrome?.search?.query) {
        // Uses chrome.search as per policy - https://developer.chrome.com/docs/extensions/reference/api/search
        await chrome.search.query({
          text: query,
          disposition: "CURRENT_TAB",
        });
      } else {
        // Fallback just incase
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
          query
        )}`;
      }
    } catch (error) {
      console.error("Search failed:", error);

      // Fallback just incase
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        query
      )}`;
    }
  };

  return {
    query,
    setQuery,
    handleAnimationEnd,
    handleSubmit,
    shouldRender,
    isSearchToggled,
  };
};
