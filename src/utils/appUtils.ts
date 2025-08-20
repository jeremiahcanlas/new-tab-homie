import greetService from "../services/greet/greetingService";
import quoteService from "../services/quote/QuoteService";

export const getInitialProps = async () => {
  const greetingMessage = await greetService.getGreeting();
  const quote = await quoteService.getQuote();

  const data = {
    greetingMessage,
    quote,
  };

  return data;
};
