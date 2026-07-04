import { getCached, setCached } from "./offline/localCache";
import defaultDocuments from "../data/documents.json";
import { makeId } from "../utils/id";

const KEY = "documents";

export async function loadDocuments() {
  return getCached(KEY, defaultDocuments);
}

async function saveDocuments(list) {
  await setCached(KEY, list);
  return list;
}

export async function addDocument(name) {
  const list = await loadDocuments();
  return saveDocuments([...list, { id: makeId("doc"), name, note: "", checked: false }]);
}

export async function updateDocument(id, patch) {
  const list = await loadDocuments();
  return saveDocuments(list.map((d) => (d.id === id ? { ...d, ...patch } : d)));
}

export async function deleteDocument(id) {
  const list = await loadDocuments();
  return saveDocuments(list.filter((d) => d.id !== id));
}
