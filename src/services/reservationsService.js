import { getCached, setCached } from "./offline/localCache";
import defaultReservations from "../data/reservations.json";
import { makeId } from "../utils/id";

const KEY = "reservations";

export async function loadReservations() {
  return getCached(KEY, defaultReservations);
}

async function saveReservations(list) {
  await setCached(KEY, list);
  return list;
}

export function emptyReservation() {
  return {
    id: makeId("res"),
    category: "autre",
    name: "",
    date: "",
    time: "",
    city: "",
    confirmation: "",
    link: "",
    phone: "",
    price: "",
    notes: "",
    status: "a_reserver",
  };
}

export async function upsertReservation(reservation) {
  const list = await loadReservations();
  const idx = list.findIndex((r) => r.id === reservation.id);
  const next =
    idx >= 0
      ? list.map((r, i) => (i === idx ? reservation : r))
      : [...list, reservation];
  return saveReservations(next);
}

export async function deleteReservation(id) {
  const list = await loadReservations();
  return saveReservations(list.filter((r) => r.id !== id));
}
