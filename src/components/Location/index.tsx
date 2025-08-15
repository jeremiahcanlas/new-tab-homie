import { LocationPin } from "../../assets/vectors";
import { useLocation } from "../../hooks/location";

const Location = (): React.JSX.Element => {
  const { location, loading, error } = useLocation();

  if (error) return <div>Error retrieving location</div>;

  if (loading || !location) return <div>Loading...</div>;

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
