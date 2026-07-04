import { useEffect, useState } from "react";

const CACHE = new Map(); // clé "lat,lon" -> { data, ts }
const TTL_MS = 15 * 60 * 1000;
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const WEATHER_ICONS = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌦️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "🌨️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

function iconFor(code) {
  return WEATHER_ICONS[code] || "🌡️";
}

// Météo en temps réel (pas une prévision pour une date future — l'API ne
// prévoit qu'à ~2 semaines, inutile pour un voyage dans plusieurs mois) via
// Open-Meteo, service public gratuit sans clé API. Cache mémoire léger pour
// éviter de re-fetcher à chaque re-render de composants voisins qui
// partagent la même ville (ex: NextStopCard + DayPage).
export function useWeather(lat, lon) {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  useEffect(() => {
    if (lat == null || lon == null) {
      setStatus("error");
      return;
    }
    const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    const cached = CACHE.get(key);
    if (cached && Date.now() - cached.ts < TTL_MS) {
      setWeather(cached.data);
      setStatus("ok");
      return;
    }

    let cancelled = false;
    fetch(`${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const cw = data.current_weather;
        if (!cw) throw new Error("no current_weather");
        const result = { tempC: Math.round(cw.temperature), code: cw.weathercode, icon: iconFor(cw.weathercode) };
        CACHE.set(key, { data: result, ts: Date.now() });
        setWeather(result);
        setStatus("ok");
      })
      .catch((e) => {
        console.warn("Open-Meteo indisponible :", e);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  return { weather, status };
}
