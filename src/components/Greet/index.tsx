import { useDashboardSettings } from "../../context/DashboardSettingsContext";

type GreetProp = {
  message: string;
};

const Greet = ({ message }: GreetProp): React.JSX.Element => {
  const { username } = useDashboardSettings();

  const personalizedGreeting = username
    ? message.replace("{{name}}", username)
    : message.replace(", {{name}}", "");
  return (
    <div className="uppercase max-w-[80vw]">
      <h1 className="whitespace-nowrap">{personalizedGreeting}</h1>
    </div>
  );
};

export default Greet;
