import { useEffect, useState } from "react";
import { C } from "../styles/theme";
import ShoppingList from "../components/shopping/ShoppingList";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import {
  loadShopping,
  addList,
  renameList,
  deleteList,
  addItem,
  updateItem,
  deleteItem,
} from "../services/shoppingService";

export default function ShoppingPage() {
  const [data, setData] = useState(null);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    loadShopping().then(setData);
  }, []);

  if (!data) return <LoadingState />;

  const totalRemaining = data.lists.reduce((s, l) => s + l.items.filter((it) => !it.checked).length, 0);

  async function handleAddList(e) {
    e.preventDefault();
    if (!newListName.trim()) return;
    const next = await addList(newListName.trim());
    setData(next);
    setNewListName("");
  }

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, color: C.gold, fontWeight: 700 }}>🛒 Listes de courses</div>
        <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{totalRemaining} articles restants au total</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14, marginBottom: 18 }}>
        {data.lists.map((list) => (
          <ShoppingList
            key={list.id}
            list={list}
            onAddItem={(name) => addItem(list.id, name).then(setData)}
            onToggleItem={(itemId, checked) => updateItem(list.id, itemId, { checked }).then(setData)}
            onDeleteItem={(itemId) => deleteItem(list.id, itemId).then(setData)}
            onRename={(name) => renameList(list.id, name).then(setData)}
            onDeleteList={() => {
              if (confirm(`Supprimer la liste "${list.name}" ?`)) deleteList(list.id).then(setData);
            }}
          />
        ))}
        {data.lists.length === 0 && <EmptyState icon="🛒" text="Aucune liste pour l'instant." />}
      </div>

      <form onSubmit={handleAddList} style={{ display: "flex", gap: 8, maxWidth: 340 }}>
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Nouvelle catégorie..."
          style={{ flex: 1, background: C.card, border: `1px solid ${C.line}`, borderRadius: 8, padding: "10px 12px", color: C.cream, fontSize: 13 }}
        />
        <button
          type="submit"
          style={{ background: `linear-gradient(135deg,${C.gold},#9a7420)`, border: "none", borderRadius: 8, padding: "10px 16px", color: "#1a1200", fontWeight: 700, cursor: "pointer" }}
        >
          + Liste
        </button>
      </form>
    </div>
  );
}
