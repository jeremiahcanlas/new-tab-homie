import type LocationProvider from "./LocationProvider";

const locationService: LocationProvider = {
  async getLocation(geolocation) {
    const isLocationDisabled = !geolocation;

    if (!geolocation) {
      geolocation = {
        lat: 43.65107,
        lon: -79.347015,
      };
    }

    const { lat, lon } = geolocation;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=10&format=json`,

        {
          headers: {
            "User-Agent": "homie-app/0.2.0 (contact: email@email.com)",
          },
        }
      );
      if (!res.ok) return null;
      let data = await res.json();

      data = {
        city: data.name,
        stateProvince: data.address.state,
        locationDisabled: isLocationDisabled,
      };

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

export default locationService;
