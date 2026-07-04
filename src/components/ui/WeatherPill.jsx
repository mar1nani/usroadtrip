import { C } from "../../styles/theme";
import { useWeather } from "../../hooks/useWeather";

export default function WeatherPill({ lat, lon, style }) {
  const { weather, status } = useWeather(lat, lon);
  if (status !== "ok" || !weather) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, color: C.cream, fontWeight: 600, ...style }}>
      {weather.icon} {weather.tempC}°C
    </span>
  );
}
