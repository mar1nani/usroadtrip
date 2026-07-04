import { useState } from "react";
import { C } from "../../styles/theme";
import Card from "../ui/Card";

export default function ShoppingList({ list, onAddItem, onToggleItem, onDeleteItem, onRename, onDeleteList }) {
  const [newItem, setNewItem] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(list.name);
  const remaining = list.items.filter((it) => !it.checked).length;

  function submitItem(e) {
    e.preventDefault();
    if (!newItem.trim()) return;
    onAddItem(newItem.trim());
    setNewItem("");
  }

  function submitName() {
    setEditingName(false);
    if (nameDraft.trim() && nameDraft !== list.name) onRename(nameDraft.trim());
  }

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        {editingName ? (
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={submitName}
            onKeyDown={(e) => e.key === "Enter" && submitName()}
            style={{ background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 6, padding: "4px 8px", color: C.cream, fontSize: 15, fontWeight: 700 }}
          />
        ) : (
          <div onClick={() => setEditingName(true)} style={{ fontSize: 15, color: C.cream, fontWeight: 700, cursor: "pointer" }}>
            {list.name}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: C.dim }}>
            {remaining} restant{remaining > 1 ? "s" : ""}
          </span>
          <button onClick={onDeleteList} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 15 }}>
            🗑️
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
        {list.items.map((it) => (
          <div
            key={it.id}
            style={{ display: "flex", alignItems: "center", gap: 8, background: it.checked ? "#0e1838" : "transparent", borderRadius: 8, padding: "6px 8px" }}
          >
            <div
              onClick={() => onToggleItem(it.id, !it.checked)}
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                border: `2px solid ${it.checked ? C.gold : "#556088"}`,
                background: it.checked ? C.gold : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {it.checked && <span style={{ color: "#0a1130", fontSize: 12, fontWeight: 900 }}>✓</span>}
            </div>
            <div style={{ flex: 1, fontSize: 13.5, color: it.checked ? C.dim : C.cream, textDecoration: it.checked ? "line-through" : "none" }}>
              {it.name}
            </div>
            <button onClick={() => onDeleteItem(it.id)} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 13 }}>
              ✕
            </button>
          </div>
        ))}
        {list.items.length === 0 && (
          <div style={{ fontSize: 12, color: C.dim, textAlign: "center", padding: "6px 0" }}>Liste vide</div>
        )}
      </div>

      <form onSubmit={submitItem} style={{ display: "flex", gap: 6 }}>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Ajouter un article..."
          style={{ flex: 1, background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 10px", color: C.cream, fontSize: 13 }}
        />
        <button
          type="submit"
          style={{ background: C.accent, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 12px", color: C.gold, cursor: "pointer", fontWeight: 700 }}
        >
          +
        </button>
      </form>
    </Card>
  );
}
