type QuoteProps = {
  quote: { author: string; text: string } | null | undefined;
};

const Quote = ({ quote }: QuoteProps) => {
  if (!quote) return;

  return (
    <div
      key={quote.author}
      className=" md:mt-auto border rounded-sm p-5 w-full md:w-[40%] shadow-md relative"
    >
      <p className="font-light mr-3">{quote?.text}</p>
      <p className="mt-2">{quote.author}</p>
    </div>
  );
};

export default Quote;
