import { useEffect, useState } from "react";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";

const getDateTime = (twelveHourMode: boolean) => {
  const now = new Date();

  const currentDate = now.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const currentTime = now
    .toLocaleString("en-US", {
      hour: "2-digit",
      hour12: twelveHourMode,
      minute: "2-digit",
    })
    .replace(/ AM| PM/, "");

  return {
    currentDate,
    currentTime,
  };
};

export const useClock = () => {
  const { twelveHourMode } = useDashboardSettings();

  const [dateTime, setDateTime] = useState(getDateTime(twelveHourMode));

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(getDateTime(twelveHourMode));
    }, 1000);

    return () => clearInterval(interval);
  }, [twelveHourMode]);

  return { dateTime };
};
