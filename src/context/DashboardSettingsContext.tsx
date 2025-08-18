import React, { createContext, useContext, useState, useEffect } from "react";

interface DashboardSettingsContextType {
  unit: "celsius" | "fahrenheit";
  setUnit: (unit: "celsius" | "fahrenheit") => void;
  username: string;
  setUsername: (username: string) => void;
  clockFormat: "12" | "24";
  setClockFormat: (clockFormat: "12" | "24") => void;
  darkToggled: boolean;
  setDarkToggled: (darkToggled: boolean) => void;
}

const DashboardSettingsContext = createContext<DashboardSettingsContextType>({
  unit: "celsius",
  setUnit: () => {},
  username: "",
  setUsername: () => {},
  clockFormat: "12",
  setClockFormat: () => {},
  darkToggled: false,
  setDarkToggled: () => {},
});

export const DashboardSettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // weather unit
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">(() => {
    const stored = localStorage.getItem("temp_unit");
    return stored === "celsius" || stored === "fahrenheit" ? stored : "celsius";
  });

  // username
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  });

  // clock format
  const [clockFormat, setClockFormat] = useState<"12" | "24">(() => {
    const stored = localStorage.getItem("clockFormat");
    return stored === "12" ? "12" : "24";
  });

  // dark mode toggle
  const [darkToggled, setDarkToggled] = useState<boolean>(() => {
    const stored = localStorage.getItem("darkToggled") || "false";
    return JSON.parse(stored);
  });

  useEffect(() => {
    const shouldUseDark = darkToggled;

    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, [darkToggled]);

  // Write changes to localStorage
  useEffect(() => {
    localStorage.setItem("temp_unit", unit);
    localStorage.setItem("username", username);
    localStorage.setItem("clockFormat", clockFormat);
    localStorage.setItem("darkToggled", JSON.stringify(darkToggled));
  }, [unit, username, clockFormat, darkToggled]);

  // Sync changes from other tabs
  useEffect(() => {
    const syncSettings = (e: StorageEvent) => {
      if (
        e.key === "temp_unit" &&
        (e.newValue === "celsius" || e.newValue === "fahrenheit")
      ) {
        setUnit(e.newValue);
      }
      if (e.key === "username" && e.newValue) {
        setUsername(e.newValue);
      }
      if (
        e.key === "clockFormat" &&
        (e.newValue === "12" || e.newValue === "24")
      ) {
        setClockFormat(e.newValue as "12" | "24");
      }

      if (e.key === "darkToggled" && e.newValue) {
        setDarkToggled(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", syncSettings);
    return () => window.removeEventListener("storage", syncSettings);
  }, []);

  return (
    <DashboardSettingsContext.Provider
      value={{
        unit,
        setUnit,
        username,
        setUsername,
        clockFormat,
        setClockFormat,
        darkToggled,
        setDarkToggled,
      }}
    >
      {children}
    </DashboardSettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboardSettings = () => useContext(DashboardSettingsContext);
