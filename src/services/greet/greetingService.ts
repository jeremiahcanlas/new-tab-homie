import type GreetingProvider from "./GreetingProvider";
import greetings from "../../data/greetings.json";

const greetService: GreetingProvider = {
  async getGreeting() {
    const hour = new Date().getHours();

    const currentPeriod = greetings.find(
      (g) => hour >= g.range.start && hour < g.range.end
    );

    if (!currentPeriod) return "";

    const randomMsg =
      currentPeriod.messages[
        Math.floor(Math.random() * currentPeriod.messages.length)
      ];

    return randomMsg;
  },
};

export default greetService;
