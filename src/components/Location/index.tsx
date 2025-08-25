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
    <h2 className="align-middle">
      <span className="inline-block w-5 align-text-bottom">
        <LocationPin />
      </span>
      {city}
      {stateProvince ? ", " + stateProvince : ""}
    </h2>
  );
};

export default Location;
