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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const baseUrl = "https://www.google.com/search";

    window.location.href = `${baseUrl}?q=${encodeURIComponent(query)}`;
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
