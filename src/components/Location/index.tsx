import { LocationPin } from "../../assets/vectors";
import type { LocationData } from "../../types";

type Props = {
  location: LocationData;
};

const Location = ({ location }: Props): React.JSX.Element => {
  return (
    <h2 className="align-middle">
      <span className="inline-block w-5 align-text-bottom">
        <LocationPin />
      </span>
      {location.city}
      {location.stateProvince ? ", " + location.stateProvince : ""}
    </h2>
  );
};

export default Location;
