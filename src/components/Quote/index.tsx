import { useQuote } from "../../hooks/quote";

const Quote = (): React.JSX.Element => {
  const { quote, loading } = useQuote();

  if (!quote || loading) return <></>;

  const { text, author } = quote;

  return (
    <div
      key={author}
      className=" md:mt-auto border border-gray-300 rounded-sm p-5 w-full md:w-max md:max-w-[35%] shadow-outline relative animate-fade-in"
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
