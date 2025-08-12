import { useEffect, useState } from "react";

type GreetProp = {
  message: string;
};

const Greet = ({ message }: GreetProp): React.JSX.Element => {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  useEffect(() => {
    const handler = () => {
      setUsername(localStorage.getItem("username") || "");
    };
    window.addEventListener("username-changed", handler);
    return () => window.removeEventListener("username-changed", handler);
  }, []);

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
