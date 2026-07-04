import { useEffect, useState } from "react";
import MAP_PTS from "../data/mapPoints.json";
import { nearestMapPoint } from "../utils/gps";
import { loadSettings } from "../services/settingsService";

// Même position que CHI dans TripMap.jsx / MAP_PTS[21] (Jour 22, Chicago) —
// connue exactement, aucun calcul GPS nécessaire pour la simulation.
const CHICAGO_MAP_POINT = { x: 612.7, y: 207.9 };

// Position de la voiture à afficher sur la carte : {x, y} en pixels SVG, ou
// null si aucune position n'est disponible (le composant appelant retombe
// alors sur son comportement par défaut basé sur le calendrier).
export function useCarPosition() {
  const [mode, setMode] = useState("simulation");
  const [carPoint, setCarPoint] = useState(null);

  useEffect(() => {
    loadSettings().then((s) => setMode(s.gpsMode || "simulation"));
  }, []);

  useEffect(() => {
    if (mode === "simulation") {
      setCarPoint(CHICAGO_MAP_POINT);
      return;
    }

    if (mode === "real" && typeof navigator !== "undefined" && navigator.geolocation) {
      setCarPoint(null); // efface la position simulée le temps d'obtenir un premier fix réel
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          const nearest = nearestMapPoint(coords, MAP_PTS);
          setCarPoint(nearest ? { x: nearest.x, y: nearest.y } : null);
        },
        (err) => {
          console.warn("Géolocalisation indisponible :", err.message);
          setCarPoint(null);
        },
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 15000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }

    setCarPoint(null);
  }, [mode]);

  return carPoint;
}
