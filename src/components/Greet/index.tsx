import { usePersonalizedGreet } from "../../hooks/greet";

type GreetProp = {
  message: string;
};

const Greet = ({ message }: GreetProp): React.JSX.Element => {
  const { personalizedGreeting } = usePersonalizedGreet(message);

  return (
    <div className="uppercase max-w-[80vw]">
      <h1 className="font-medium text-[min(30vw,1.2em)]">
        {personalizedGreeting}
      </h1>
    </div>
  );
};

export default Greet;
