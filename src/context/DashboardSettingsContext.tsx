import React, { createContext, useContext, useState, useEffect } from "react";
import type { DashboardSettingsContextType } from "../types";

const DashboardSettingsContext = createContext<DashboardSettingsContextType>({
  username: "",
  setUsername: () => {},
  isCelsius: false,
  toggleUseCelsius: () => {},
  twelveHourMode: false,
  setTwelveHourMode: () => {},
  darkToggled: false,
  setDarkToggled: () => {},
  isSearchToggled: false,
  toggleSearch: () => {},
  isQuoteToggled: false,
  toggleQuote: () => {},
});

export const DashboardSettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // username
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  });

  const [twelveHourMode, setTwelveHourMode] = useState<boolean>(() => {
    const stored = localStorage.getItem("twelveHourMode") || "false";
    return JSON.parse(stored);
  });

  const [isCelsius, toggleUseCelsius] = useState<boolean>(() => {
    const stored = localStorage.getItem("useCelsius") || "false";
    return JSON.parse(stored);
  });

  // dark mode
  const [darkToggled, setDarkToggled] = useState<boolean>(() => {
    const stored = localStorage.getItem("darkToggled") || "false";
    return JSON.parse(stored);
  });

  // dark mode toggle
  const [isSearchToggled, toggleSearch] = useState<boolean>(() => {
    const stored = localStorage.getItem("enableSearch") || "false";
    return JSON.parse(stored);
  });

  // quote toggle
  const [isQuoteToggled, toggleQuote] = useState<boolean>(() => {
    const stored = localStorage.getItem("enableQuote") || "false";
    return JSON.parse(stored);
  });

  useEffect(() => {
    const shouldUseDark = darkToggled;

    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, [darkToggled]);

  useEffect(() => {
    localStorage.setItem("username", username);
    localStorage.setItem("useCelsius", JSON.stringify(isCelsius));
    localStorage.setItem("twelveHourMode", JSON.stringify(twelveHourMode));
    localStorage.setItem("darkToggled", JSON.stringify(darkToggled));
    localStorage.setItem("enableSearch", JSON.stringify(isSearchToggled));
    localStorage.setItem("enableQuote", JSON.stringify(isQuoteToggled));
  }, [
    // unit,
    username,
    isCelsius,
    twelveHourMode,
    // clockFormat,
    darkToggled,
    isSearchToggled,
    isQuoteToggled,
  ]);

  // Sync changes from other tabs
  useEffect(() => {
    const syncSettings = (e: StorageEvent) => {
      if (e.key === "username" && e.newValue) {
        setUsername(e.newValue);
      }

      if (
        e.key === "isCelsius" &&
        e.newValue &&
        (e.newValue === "true" || e.newValue === "false")
      ) {
        toggleUseCelsius(JSON.parse(e.newValue));
      }
      if (
        e.key === "twelveHourMode" &&
        e.newValue &&
        (e.newValue === "true" || e.newValue === "false")
      ) {
        setTwelveHourMode(JSON.parse(e.newValue));
      }

      if (
        e.key === "darkToggled" &&
        e.newValue &&
        (e.newValue === "true" || e.newValue === "false")
      ) {
        setDarkToggled(JSON.parse(e.newValue));
      }

      if (
        e.key === "enableSearch" &&
        e.newValue &&
        (e.newValue === "true" || e.newValue === "false")
      ) {
        toggleSearch(JSON.parse(e.newValue));
      }

      if (
        e.key === "enableQuote" &&
        e.newValue &&
        (e.newValue === "true" || e.newValue === "false")
      ) {
        toggleSearch(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", syncSettings);
    return () => window.removeEventListener("storage", syncSettings);
  }, []);

  return (
    <DashboardSettingsContext.Provider
      value={{
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
      }}
    >
      {children}
    </DashboardSettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboardSettings = () => useContext(DashboardSettingsContext);
