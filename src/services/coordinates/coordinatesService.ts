import type CoordinatesProvider from "./CoordinatesProvider";

const coordinatesService: CoordinatesProvider = {
  async getCoords() {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const cachedCoordsRaw = localStorage.getItem("user_coords");
          const cachedCoords = cachedCoordsRaw
            ? JSON.parse(cachedCoordsRaw)
            : null;

          const { latitude, longitude } = position.coords;

          const newCoords = {
            lat: parseFloat(latitude.toFixed(5)),
            lon: parseFloat(longitude.toFixed(5)),
          };

          const coordsChanged =
            !cachedCoords ||
            cachedCoords.lat !== newCoords.lat ||
            cachedCoords.lon !== newCoords.lon;

          if (coordsChanged) {
            console.log("Coords changed, updating...");
            localStorage.setItem("user_coords", JSON.stringify(newCoords));
          }

          resolve(newCoords);
        },
        (err) => {
          console.log("Error getting coords:", err);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        }
      );
    });
  },
};

export default coordinatesService;
