import { NavLink } from "react-router-dom";
import { C } from "../../styles/theme";
import { clearAll } from "../../services/offline/localCache";
import { usePermissions } from "../../hooks/usePermissions";

// Étapes de voyage, lieux, photos : visible par tout le monde, y compris un
// invité qui n'a que le lien de partage — rien de personnel ni de financier.
const NAV_ITEMS_GUEST = [
  { to: "/", label: "Accueil", icon: "🏠", end: true },
  { to: "/chicago", label: "Chicago (pré-trip)", icon: "🏙️" },
  { to: "/days", label: "Journées", icon: "📅" },
  { to: "/shopping", label: "Courses", icon: "🛒" },
  { to: "/converter", label: "Convertisseur", icon: "🔄" },
  { to: "/gallery", label: "Galerie", icon: "📸" },
  { to: "/checklist", label: "Checklist départ", icon: "✅" },
  { to: "/settings", label: "Se connecter", icon: "🔑" },
];

// Marouane/Isabelle : accès complet (budget, réservations, documents, vol...).
const NAV_ITEMS_FULL = [
  { to: "/", label: "Accueil", icon: "🏠", end: true },
  { to: "/chicago", label: "Chicago (pré-trip)", icon: "🏙️" },
  { to: "/days", label: "Journées", icon: "📅" },
  { to: "/reservations", label: "Réservations", icon: "📋" },
  { to: "/shopping", label: "Courses", icon: "🛒" },
  { to: "/converter", label: "Convertisseur", icon: "🔄" },
  { to: "/gallery", label: "Galerie", icon: "📸" },
  { to: "/stats", label: "Statistiques", icon: "📊" },
  { to: "/budget", label: "Budget", icon: "💰" },
  { to: "/documents", label: "Documents", icon: "📄" },
  { to: "/checklist", label: "Checklist départ", icon: "✅" },
  { to: "/settings", label: "Paramètres", icon: "⚙️" },
];

export default function SidebarNav({ onNavigate }) {
  const { role } = usePermissions();
  const isGuest = role === "guest";
  const items = isGuest ? NAV_ITEMS_GUEST : NAV_ITEMS_FULL;

  async function handleReset() {
    if (!confirm("Réinitialiser toutes les données locales (progression, réservations, courses, checklist, documents, réglages) ? Cette action est irréversible.")) return;
    await clearAll();
    window.location.reload();
  }

  return (
    <nav style={{ padding: "18px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 3,
          color: C.gold,
          textTransform: "uppercase",
          fontWeight: 700,
          padding: "6px 12px 14px",
        }}
      >
        ★ Road Trip USA
      </div>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 9,
            fontSize: 13.5,
            fontWeight: isActive ? 700 : 500,
            color: isActive ? "#1a1200" : C.cream,
            background: isActive ? `linear-gradient(135deg,${C.gold},#c8992e)` : "transparent",
            textDecoration: "none",
          })}
        >
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}

      {!isGuest && (
        <>
          <div style={{ height: 1, background: C.line, margin: "10px 4px" }} />
          <button
            onClick={handleReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 9,
              fontSize: 13.5,
              fontWeight: 500,
              color: C.red,
              background: "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 16 }}>🗑️</span>
            Tout réinitialiser
          </button>
        </>
      )}
    </nav>
  );
}
