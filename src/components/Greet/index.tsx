type GreetProp = {
  message: string;
};

const Greet = ({ message }: GreetProp): React.JSX.Element => {
  return (
    <div className="uppercase max-w-[80vw]">
      <h1 className="whitespace-nowrap">{message}</h1>
    </div>
  );
};

export default Greet;
