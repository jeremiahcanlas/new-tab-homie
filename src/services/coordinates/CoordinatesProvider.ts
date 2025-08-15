import type { CoordsData } from "../../types";

export default interface CoordinatesProvider {
  getCoords(): Promise<CoordsData | null>;
}
