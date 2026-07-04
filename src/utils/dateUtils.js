import flights from "../data/flights.json";

// Instants UTC exacts (pas de dépendance au fuseau horaire de l'appareil qui exécute le code).
export const FLIGHT_DEPARTURE_UTC = new Date(flights.outbound.departure.utc);
export const FLIGHT_ARRIVAL_UTC = new Date(flights.outbound.arrival.utc);
export const RETURN_DEPARTURE_UTC = new Date(flights.return.departure.utc);
export const RETURN_ARRIVAL_UTC = new Date(flights.return.arrival.utc);
// "Jour du vol" = du décollage jusqu'à 24h après, large marge couvrant l'arrivée + le décalage horaire.
export const FLIGHT_DAY_END_UTC = new Date(FLIGHT_DEPARTURE_UTC.getTime() + 24 * 3600000);

export const TRIP_START = new Date(2026, 7, 22); // 22 août 2026 (mois 0-indexé) — début du road trip à Chicago
export const TRIP_DAYS_COUNT = 22;
export const TRIP_END_EXCLUSIVE = new Date(TRIP_START.getTime() + TRIP_DAYS_COUNT * 86400000);

// before-flight → flight-day (✈️) → pretrip (Chicago) → during (les 22 jours)
// → return-countdown (avant le vol retour) → after
// `flightDepartureUtc`/`returnDepartureUtc` optionnels : permettent de calculer
// le statut sur le vol d'un utilisateur précis (voir usePermissions/scope) —
// par défaut, les constantes ci-dessus (vol de Marouane), donc tous les appels
// existants qui ne les passent pas continuent de fonctionner à l'identique.
export function tripStatus(now = new Date(), flightDepartureUtc = FLIGHT_DEPARTURE_UTC, returnDepartureUtc = RETURN_DEPARTURE_UTC) {
  const flightDayEnd = new Date(flightDepartureUtc.getTime() + 24 * 3600000);
  if (now < flightDepartureUtc) return "before-flight";
  if (now < flightDayEnd) return "flight-day";
  if (now < TRIP_START) return "pretrip";
  if (now < TRIP_END_EXCLUSIVE) return "during";
  if (now < returnDepartureUtc) return "return-countdown";
  return "after";
}

export function currentDayIndex(now = new Date()) {
  const diff = Math.floor((now - TRIP_START) / 86400000);
  if (diff < 0) return 0;
  if (diff > TRIP_DAYS_COUNT - 1) return TRIP_DAYS_COUNT - 1;
  return diff;
}

export function daysUntil(targetDate, now = new Date()) {
  return Math.ceil((targetDate - now) / 86400000);
}

const US_CENTRAL_OFFSET_MS = 5 * 3600000; // UTC-5 (CDT) — valide pour la période du voyage (été, avant la bascule DST de novembre)

// Convertit un instant UTC en date calendaire "heure de Chicago", en lisant
// ensuite via les getters UTC (jamais le fuseau du navigateur), pour obtenir
// un jour civil stable quel que soit l'endroit où l'app tourne (ex: France).
function centralCalendarDate(utcIso) {
  const shifted = new Date(new Date(utcIso).getTime() - US_CENTRAL_OFFSET_MS);
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()));
}

// Dates réelles du séjour US calculées depuis les vols d'un utilisateur
// (arrivée → départ du vol retour) — contrairement à TRIP_START/TRIP_DAYS_COUNT
// qui ne décrivent que le road trip proprement dit (hors pré/post Chicago).
export function tripDateRangeFromFlights(flights) {
  const arrival = centralCalendarDate(flights.outbound.arrival.utc);
  const departure = centralCalendarDate(flights.return.departure.utc);
  const totalDays = Math.round((departure - arrival) / 86400000) + 1;
  return { arrival, departure, totalDays };
}

// Conservé pour compatibilité (délai avant le début du road trip à Chicago, pas le vol)
export function daysUntilStart(now = new Date()) {
  return daysUntil(TRIP_START, now);
}
