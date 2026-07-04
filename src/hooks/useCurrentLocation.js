import { useEffect, useState } from "react";
import MAP_PTS from "../data/mapPoints.json";
import { nearestMapPoint } from "../utils/gps";

const REFRESH_MS = 5 * 60 * 1000; // Nominatim est un service gratuit, on reste raisonnable sur la fréquence
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

// Position réelle (indépendante du mode simulation/GPS de la voiture sur la
// carte, qui sert à visualiser le trajet) : vraie position de l'appareil,
// reverse-geocodée via Nominatim (OpenStreetMap). Dégrade proprement si pas
// de GPS, pas d'autorisation, ou hors-ligne (fallback = arrêt du road trip
// le plus proche, clairement signalé comme approximatif).
export function useCurrentLocation() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | fallback | denied | unavailable

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    let cancelled = false;

    function fetchLocation() {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(`${NOMINATIM_URL}?format=json&addressdetails=1&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (cancelled) return;
            const address = data.address || {};
            setLocation({
              city: address.city || address.town || address.village || address.county || "",
              region: address.state || "",
              country: address.country || "",
              lat: latitude,
              lon: longitude,
            });
            setStatus("ok");
          } catch (e) {
            console.warn("Reverse geocoding Nominatim indisponible, repli sur l'arrêt le plus proche :", e);
            if (cancelled) return;
            const nearest = nearestMapPoint({ lat: latitude, lon: longitude }, MAP_PTS);
            setLocation(nearest ? { city: nearest.city, region: nearest.st, country: "", lat: nearest.lat, lon: nearest.lon } : null);
            setStatus("fallback");
          }
        },
        (err) => {
          console.warn("Géolocalisation refusée :", err.message);
          if (!cancelled) setStatus("denied");
        },
        { enableHighAccuracy: false, maximumAge: REFRESH_MS, timeout: 15000 }
      );
    }

    fetchLocation();
    const interval = setInterval(fetchLocation, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { location, status };
}
