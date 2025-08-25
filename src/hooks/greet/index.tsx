import { useEffect, useState } from "react";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";

export const usePersonalizedGreet = (greet: string) => {
  const { username } = useDashboardSettings();

  const [personalizedGreeting, setPersonalizedGreeting] = useState("");

  useEffect(() => {
    const modifiedGreet = username
      ? greet.replace("{{name}}", username)
      : greet.replace(", {{name}}", "");

    setPersonalizedGreeting(modifiedGreet);
  }, [greet, username]);

  return { personalizedGreeting };
};
