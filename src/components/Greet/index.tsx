import { useDashboardSettings } from "../../context/DashboardSettingsContext";

type GreetProp = {
  message: string;
};

const Greet = ({ message }: GreetProp): React.JSX.Element => {
  const { username } = useDashboardSettings();

  message = username
    ? message.replace("{{name}}", username)
    : message.replace(", {{name}}", "");
  return (
    <div className="uppercase max-w-[80vw]">
      <h1 className="whitespace-nowrap">{message}</h1>
    </div>
  );
};

export default Greet;
