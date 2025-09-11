import { useClock } from "../../hooks/clock";

const Clock = (): React.JSX.Element => {
  const { dateTime } = useClock();
  const { currentTime, currentDate } = dateTime;

  return (
    <div className="my-4">
      <h2 className="font-bold">{currentDate}</h2>
      <h1 className="text-[min(30vw,55px)] font-light leading-none">
        {currentTime}
      </h1>
    </div>
  );
};

export default Clock;
