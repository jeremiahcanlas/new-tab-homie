import greetService from "../services/greet/greetingService";

export const getInitialProps = async () => {
  const greetingMessage = await greetService.getGreeting();

  const data = {
    greetingMessage,
  };

  return data;
};
