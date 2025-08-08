import type { LocationData } from "../../types";

type Props = {
  location: LocationData;
};

const Location = ({ location }: Props): React.JSX.Element => {
  return (
    <h2>
      {location.city}
      {location.stateProvince ? ", " + location.stateProvince : ""}
    </h2>
  );
};

export default Location;
