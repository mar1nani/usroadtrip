import { getCached, setCached } from "./offline/localCache";
import { makeId } from "../utils/id";

const KEY = "trip_expenses";

// Registre partagé (pas scopé par personne, comme les réservations) : Marouane
// et Isabelle voient et modifient le même Tricount à 2 + carte commune.
export async function loadExpenses() {
  return getCached(KEY, []);
}

async function saveExpenses(list) {
  await setCached(KEY, list);
  return list;
}

export function emptyExpense() {
  return {
    id: makeId("exp"),
    title: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    category: "misc",
    paidBy: "shared_card",
    split: "shared",
    note: "",
  };
}

export async function addExpense(expense) {
  const list = await loadExpenses();
  return saveExpenses([...list, expense]);
}

export async function deleteExpense(id) {
  const list = await loadExpenses();
  return saveExpenses(list.filter((e) => e.id !== id));
}
