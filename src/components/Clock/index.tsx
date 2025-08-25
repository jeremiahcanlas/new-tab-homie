import { useClock } from "../../hooks/clock";

const Clock = (): React.JSX.Element => {
  const { dateTime } = useClock();
  const { currentTime, currentDate } = dateTime;

  return (
    <div>
      <h1>{currentTime}</h1>
      <h2>{currentDate}</h2>
    </div>
  );
};

export default Clock;
