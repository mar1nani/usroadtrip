import { getCached, setCached } from "./offline/localCache";
import marouaneSeed from "../data/flights.json";

const KEY = "flights";

export function emptyLeg() {
  return {
    flightNumber: "",
    displayDate: "",
    departure: { airportCode: "", airportName: "", time: "", utc: "" },
    arrival: { airportCode: "", airportName: "", time: "", utc: "" },
    class: "",
    meals: [],
  };
}

function emptyUserFlights() {
  return { outbound: emptyLeg(), return: emptyLeg() };
}

function defaultFlights() {
  return { marouane: marouaneSeed, isabelle: emptyUserFlights() };
}

export function isLegFilled(leg) {
  return Boolean(leg && leg.departure.utc && leg.arrival.utc);
}

export async function loadFlights() {
  return getCached(KEY, defaultFlights());
}

export async function saveUserLeg(scope, legName, legData) {
  const all = await loadFlights();
  const next = {
    ...all,
    [scope]: { ...(all[scope] || emptyUserFlights()), [legName]: legData },
  };
  await setCached(KEY, next);
  return next;
}
