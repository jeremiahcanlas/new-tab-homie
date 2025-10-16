import { usePersonalizedGreet } from "../../hooks/greet";

const Greet = (): React.JSX.Element => {
  const { personalizedGreeting } = usePersonalizedGreet();

  if (!personalizedGreeting) return <div className="h-[28.8px] invisible" />;

  return (
    <div className="uppercase max-w-[80vw]">
      <h1 className="font-medium text-[min(30vw,1.2em)]">
        {personalizedGreeting}
      </h1>
    </div>
  );
};

export default Greet;
