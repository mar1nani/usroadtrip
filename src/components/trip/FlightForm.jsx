import { useEffect, useState } from "react";
import { C } from "../../styles/theme";
import TextField from "../ui/TextField";
import { loadFlights, saveUserLeg } from "../../services/flightsService";

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function legToForm(leg) {
  const dep = leg?.departure || {};
  const arr = leg?.arrival || {};
  return {
    flightNumber: leg?.flightNumber || "",
    departureDate: dep.utc ? dep.utc.slice(0, 10) : "",
    departureTime: dep.time || "",
    departureAirportCode: dep.airportCode || "",
    departureAirportName: dep.airportName || "",
    arrivalDate: arr.utc ? arr.utc.slice(0, 10) : "",
    arrivalTime: arr.time || "",
    arrivalAirportCode: arr.airportCode || "",
    arrivalAirportName: arr.airportName || "",
    flightClass: leg?.class || "",
    meals: (leg?.meals || []).join(", "),
  };
}

function formToLeg(form) {
  const departureUtc = form.departureDate && form.departureTime ? new Date(`${form.departureDate}T${form.departureTime}:00`).toISOString() : "";
  const arrivalUtc = form.arrivalDate && form.arrivalTime ? new Date(`${form.arrivalDate}T${form.arrivalTime}:00`).toISOString() : "";
  return {
    flightNumber: form.flightNumber,
    displayDate: form.departureDate ? DATE_FMT.format(new Date(`${form.departureDate}T00:00:00`)) : "",
    departure: {
      airportCode: form.departureAirportCode,
      airportName: form.departureAirportName,
      time: form.departureTime,
      utc: departureUtc,
    },
    arrival: {
      airportCode: form.arrivalAirportCode,
      airportName: form.arrivalAirportName,
      time: form.arrivalTime,
      utc: arrivalUtc,
    },
    class: form.flightClass,
    meals: form.meals
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean),
  };
}

function LegFields({ title, form, onChange }) {
  function set(field, value) {
    onChange({ ...form, [field]: value });
  }
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{title}</div>
      <TextField label="N° de vol" value={form.flightNumber} onChange={(e) => set("flightNumber", e.target.value)} placeholder="Ex: AA151" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <TextField label="Aéroport départ (code)" value={form.departureAirportCode} onChange={(e) => set("departureAirportCode", e.target.value.toUpperCase())} placeholder="CDG" />
        <TextField label="Aéroport arrivée (code)" value={form.arrivalAirportCode} onChange={(e) => set("arrivalAirportCode", e.target.value.toUpperCase())} placeholder="ORD" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <TextField label="Nom aéroport départ" value={form.departureAirportName} onChange={(e) => set("departureAirportName", e.target.value)} placeholder="Paris Charles de Gaulle" />
        <TextField label="Nom aéroport arrivée" value={form.arrivalAirportName} onChange={(e) => set("arrivalAirportName", e.target.value)} placeholder="Chicago O'Hare" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <TextField type="date" label="Date départ" value={form.departureDate} onChange={(e) => set("departureDate", e.target.value)} />
        <TextField type="time" label="Heure départ" value={form.departureTime} onChange={(e) => set("departureTime", e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <TextField type="date" label="Date arrivée" value={form.arrivalDate} onChange={(e) => set("arrivalDate", e.target.value)} />
        <TextField type="time" label="Heure arrivée" value={form.arrivalTime} onChange={(e) => set("arrivalTime", e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <TextField label="Classe" value={form.flightClass} onChange={(e) => set("flightClass", e.target.value)} placeholder="Economy (B)" />
        <TextField label="Repas (séparés par une virgule)" value={form.meals} onChange={(e) => set("meals", e.target.value)} placeholder="Lunch, Snack" />
      </div>
    </div>
  );
}

export default function FlightForm({ scope }) {
  const [outbound, setOutbound] = useState(legToForm(null));
  const [returnLeg, setReturnLeg] = useState(legToForm(null));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadFlights().then((all) => {
      const userFlights = all[scope];
      setOutbound(legToForm(userFlights?.outbound));
      setReturnLeg(legToForm(userFlights?.return));
    });
  }, [scope]);

  async function handleSave() {
    await saveUserLeg(scope, "outbound", formToLeg(outbound));
    await saveUserLeg(scope, "return", formToLeg(returnLeg));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <LegFields title="✈️ Vol aller" form={outbound} onChange={setOutbound} />
      <LegFields title="✈️ Vol retour" form={returnLeg} onChange={setReturnLeg} />
      <button
        onClick={handleSave}
        style={{
          background: `linear-gradient(135deg,${C.gold},#9a7420)`,
          border: "none",
          borderRadius: 9,
          padding: "11px 16px",
          color: "#1a1200",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Enregistrer mon vol
      </button>
      {saved && <div style={{ fontSize: 12, color: "#3a8f5c", textAlign: "center" }}>✓ Vol enregistré</div>}
    </div>
  );
}
