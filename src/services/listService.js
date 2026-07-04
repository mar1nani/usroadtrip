import { getCached, setCached } from "./offline/localCache";
import { makeId } from "../utils/id";

// Factory pour un domaine "plusieurs listes catégorisées, chacune avec des
// items à cocher" — utilisé par les courses et la checklist de départ, qui
// ont exactement le même besoin.
export function createListService(cacheKey, defaultData) {
  async function loadLists() {
    return getCached(cacheKey, defaultData);
  }

  async function saveLists(data) {
    await setCached(cacheKey, data);
    return data;
  }

  async function addList(name) {
    const data = await loadLists();
    return saveLists({ lists: [...data.lists, { id: makeId("list"), name, items: [] }] });
  }

  async function renameList(listId, name) {
    const data = await loadLists();
    return saveLists({ lists: data.lists.map((l) => (l.id === listId ? { ...l, name } : l)) });
  }

  async function deleteList(listId) {
    const data = await loadLists();
    return saveLists({ lists: data.lists.filter((l) => l.id !== listId) });
  }

  async function addItem(listId, name) {
    const data = await loadLists();
    return saveLists({
      lists: data.lists.map((l) =>
        l.id === listId ? { ...l, items: [...l.items, { id: makeId("item"), name, checked: false }] } : l
      ),
    });
  }

  async function updateItem(listId, itemId, patch) {
    const data = await loadLists();
    return saveLists({
      lists: data.lists.map((l) =>
        l.id === listId
          ? { ...l, items: l.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)) }
          : l
      ),
    });
  }

  async function deleteItem(listId, itemId) {
    const data = await loadLists();
    return saveLists({
      lists: data.lists.map((l) =>
        l.id === listId ? { ...l, items: l.items.filter((it) => it.id !== itemId) } : l
      ),
    });
  }

  return { loadLists, addList, renameList, deleteList, addItem, updateItem, deleteItem };
}
