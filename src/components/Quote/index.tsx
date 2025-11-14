import { useQuote } from "../../hooks/quote";

const Quote = (): React.JSX.Element => {
  const { quote, loading, isQuoteToggled, handleAnimationEnd } = useQuote();

  if (!quote || loading) return <></>;

  const { text, author } = quote;

  return (
    <div
      key={author}
      className={
        "quote-container shadow-outline" +
        (isQuoteToggled ? " animate-fade-in" : " animate-slide-out-right")
      }
      onAnimationEnd={handleAnimationEnd}
    >
      <p role="quote-text" className="font-semibold text-md mr-3">
        {text}
      </p>
      <p role="quote-author" className="mt-2">
        {author}
      </p>
    </div>
  );
};

export default Quote;
