import { useEffect, useState } from "react";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";
import greetService from "../../services/greet/greetingService";

export const usePersonalizedGreet = () => {
  const { username } = useDashboardSettings();
  const [personalizedGreeting, setPersonalizedGreeting] = useState("");
  const [greet, setGreet] = useState("");

  const fetchGreeting = async () => {
    const greetingData = await greetService.getGreeting();

    setGreet(greetingData);
  };

  useEffect(() => {
    fetchGreeting();
  }, []);

  useEffect(() => {
    const modifiedGreet = username
      ? greet.replace("{{name}}", username)
      : greet.replace(", {{name}}", "");

    setPersonalizedGreeting(modifiedGreet);
  }, [greet, username]);

  return { personalizedGreeting };
};
