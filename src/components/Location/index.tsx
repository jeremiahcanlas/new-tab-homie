import { LocationPin } from "../../assets/vectors";
import type { LocationData } from "../../types";

type LocationProps = {
  location: LocationData;
  error?: string | null;
};

const Location = (props: LocationProps): React.JSX.Element => {
  const { location, error } = props;
  const { city, stateProvince } = location;

  if (error)
    return (
      <p className="border rounded border-gray-300 px-1 py-1.5">
        Error retrieving location.
      </p>
    );

  return (
    <div>
      <h2 className="align-middle font-bold text-[min(30vw,0.9em)]">
        <span className="inline-block w-5 align-text-bottom">
          <LocationPin />
        </span>
        {city}
        {stateProvince ? ", " + stateProvince : ""}
      </h2>
      <p className="text-[8px] text-gray-500 dark:text-gray-400 mt-1 text-right">
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700 dark:hover:text-gray-300"
        >
          OpenStreetMap
        </a>
      </p>
    </div>
  );
};

export default Location;
