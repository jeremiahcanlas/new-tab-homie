import { useCallback, useEffect, useState } from "react";
import { LocationPin } from "../../assets/vectors";
import type { LocationData } from "../../types";
import LocationService from "../../services/location/locationService";
import CoordinatesService from "../../services/coordinates/coordinatesService";

const Location = (): React.JSX.Element => {
  const [location, setLocation] = useState<LocationData | null>(null);

  // turn this into a custom hook TODO
  const fetchLocation = useCallback(async () => {
    const coords = await CoordinatesService.getCoords();

    if (!coords) return;

    const weatherData = await LocationService.getLocation(coords);

    setLocation(weatherData);
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  if (!location) return <div></div>;

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
