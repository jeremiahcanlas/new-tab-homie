type QuoteProps = {
  quote: { author: string; text: string } | null | undefined;
};

const Quote = ({ quote }: QuoteProps): React.JSX.Element => {
  if (!quote) return <></>;

  const { text, author } = quote;

  return (
    <div
      key={author}
      className=" md:mt-auto border border-gray-300 rounded-sm p-5 w-full md:w-max md:max-w-[35%] shadow-outline relative"
    >
      <p className="font-semibold text-md mr-3">{text}</p>
      <p className="mt-2">{author}</p>
    </div>
  );
};

export default Quote;
