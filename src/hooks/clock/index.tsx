import { useEffect, useState } from "react";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";

const getDateTime = (clockFormat: "12" | "24") => {
  const now = new Date();

  return {
    currentDate: now.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    currentTime: now
      .toLocaleString("en-US", {
        hour: "2-digit",
        hour12: clockFormat === "12",
        minute: "2-digit",
      })
      .replace(/ AM| PM/, ""),
  };
};

export const useClock = () => {
  const { clockFormat } = useDashboardSettings();

  const [dateTime, setDateTime] = useState(getDateTime(clockFormat));

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(getDateTime(clockFormat));
    }, 1000);

    return () => clearInterval(interval);
  }, [clockFormat]);

  return { dateTime };
};
