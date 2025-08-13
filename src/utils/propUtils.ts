import weatherType from "../data/weatherType.json";
import greetService from "../services/greet/localGreetingService";
import quotesService from "../services/quote/apiQuoteService";

export interface Coords {
  lat: number;
  lon: number;
}

export const getCoords = async (): Promise<Coords | null> => {
  if (!navigator.geolocation) {
    console.error("Geolocation not supported");
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords: Coords = {
          lat: parseFloat(position.coords.latitude.toFixed(5)),
          lon: parseFloat(position.coords.longitude.toFixed(5)),
        };

        const cachedCoordsRaw = localStorage.getItem("user_coords");
        const cachedCoords: Coords | null = cachedCoordsRaw
          ? JSON.parse(cachedCoordsRaw)
          : null;

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
};

export const getLocation = async (geolocation: string) => {
  const { lat, lon } = JSON.parse(geolocation);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=10&format=json`,

      {
        headers: {
          "User-Agent": "homie-app/0.1.1 (contact: jjmcanlas@gmail.com)",
        },
      }
    );
    if (!res.ok) return null;
    let data = await res.json();

    data = {
      city: data.name,
      stateProvince: data.address.state,
    };

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getWeather = async (geolocation: string, unit: string) => {
  const { lat, lon } = JSON.parse(geolocation);

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&temperature_unit=${unit}&current_weather=true&hourly=apparent_temperature`
    );

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();

    const { current_weather, current_weather_units, hourly } = data;

    const weatherCode = JSON.stringify(current_weather.weathercode);

    const weatherStatus = weatherType[weatherCode as keyof typeof weatherType];

    const feelsLike = Math.round(
      hourly.apparent_temperature[
        hourly.time.indexOf(current_weather.time.slice(0, 13) + ":00")
      ]
    );

    const filteredData = {
      temperature: Math.round(current_weather.temperature),
      unit: current_weather_units.temperature,
      weatherStatus,
      feelsLike,
    };

    return filteredData;
  } catch (error) {
    console.error(error);
  }
};

export const getInitialProps = async () => {
  // Initialize coordinates for weather and location
  await getCoords();

  const geolocation = localStorage.getItem("user_coords");
  const unit = localStorage.getItem("temp_unit") || "celcius";

  const greetingMessage = await greetService.getGreeting();
  let location = null;
  let weather = null;
  const quote = await quotesService.getQuote();

  if (geolocation && unit) {
    location = await getLocation(geolocation);
    weather = await getWeather(geolocation, unit);
  }

  const data = {
    location,
    greetingMessage,
    weather,
    quote,
  };

  return data;
};
