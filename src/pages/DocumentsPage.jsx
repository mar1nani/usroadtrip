import { useEffect, useState } from "react";
import { C } from "../styles/theme";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import { loadDocuments, addDocument, updateDocument, deleteDocument } from "../services/documentsService";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    loadDocuments().then(setDocuments);
  }, []);

  if (!documents) return <LoadingState />;

  const doneCount = documents.filter((d) => d.checked).length;

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    const next = await addDocument(newName.trim());
    setDocuments(next);
    setNewName("");
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, color: C.gold, fontWeight: 700 }}>📄 Documents</div>
        <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>
          {doneCount} / {documents.length} vérifiés
        </div>
      </div>

      {documents.length === 0 ? (
        <EmptyState icon="📄" text="Aucun document pour l'instant." />
      ) : (
        <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
          {documents.map((doc) => (
            <Card key={doc.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                onClick={() => updateDocument(doc.id, { checked: !doc.checked }).then(setDocuments)}
                style={{
                  flexShrink: 0,
                  marginTop: 2,
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: `2px solid ${doc.checked ? C.gold : "#556088"}`,
                  background: doc.checked ? C.gold : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {doc.checked && <span style={{ color: "#0a1130", fontSize: 14, fontWeight: 900 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: doc.checked ? C.dim : C.cream, fontWeight: 600, textDecoration: doc.checked ? "line-through" : "none" }}>
                  {doc.name}
                </div>
                <input
                  value={doc.note}
                  onChange={(e) => updateDocument(doc.id, { note: e.target.value }).then(setDocuments)}
                  placeholder="Numéro, date d'expiration, note..."
                  style={{ width: "100%", marginTop: 6, background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 6, padding: "6px 9px", color: C.cream, fontSize: 12.5 }}
                />
              </div>
              <button
                onClick={() => deleteDocument(doc.id).then(setDocuments)}
                style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 14, flexShrink: 0 }}
              >
                ✕
              </button>
            </Card>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8 }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Ajouter un document..."
          style={{ flex: 1, background: C.card, border: `1px solid ${C.line}`, borderRadius: 8, padding: "10px 12px", color: C.cream, fontSize: 13 }}
        />
        <button
          type="submit"
          style={{ background: `linear-gradient(135deg,${C.gold},#9a7420)`, border: "none", borderRadius: 8, padding: "10px 16px", color: "#1a1200", fontWeight: 700, cursor: "pointer" }}
        >
          + Ajouter
        </button>
      </form>
    </div>
  );
}
