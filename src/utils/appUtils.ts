import GreetService from "../services/greet/greetingService";
import QuoteService from "../services/quote/quoteService";

export const getInitialProps = async () => {
  const greetingMessage = await GreetService.getGreeting();
  const quote = await QuoteService.getQuote();

  const data = {
    greetingMessage,
    quote,
  };

  return data;
};
