import { C } from "../../styles/theme";
import WeatherPill from "../ui/WeatherPill";

const STATUS_TEXT = {
  loading: "Localisation en cours...",
  denied: "Autorisation de localisation refusée",
  unavailable: "Géolocalisation non disponible sur cet appareil",
};

export default function CurrentLocationCard({ location, status }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>
        📍 Ma position
      </div>
      {(status === "ok" || status === "fallback") && location ? (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ fontSize: 15, color: C.cream, fontWeight: 700 }}>
              {[location.city, location.region, location.country].filter(Boolean).join(", ")}
            </div>
            {location.lat != null && <WeatherPill lat={location.lat} lon={location.lon} />}
          </div>
          {status === "fallback" && (
            <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>≈ approximatif (étape du road trip la plus proche)</div>
          )}
        </>
      ) : (
        <div style={{ fontSize: 13, color: C.dim }}>{STATUS_TEXT[status] || "..."}</div>
      )}
    </div>
  );
}
