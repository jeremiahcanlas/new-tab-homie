import type { CoordsData, LocationData } from "../../types";

export default interface LocationProvider {
  getLocation(geolocation: CoordsData | null): Promise<LocationData>;
}
