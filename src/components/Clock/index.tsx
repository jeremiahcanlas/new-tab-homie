import { useClock } from "../../hooks/clock";

const Clock = (): React.JSX.Element => {
  const { dateTime } = useClock();

  return (
    <div>
      <h1>{dateTime.currentTime}</h1>
      <h2>{dateTime.currentDate}</h2>
    </div>
  );
};

export default Clock;
