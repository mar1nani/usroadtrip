import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import TopBar from "./TopBar";

const TITLES = {
  "/": "Accueil",
  "/chicago": "Chicago (pré-trip)",
  "/reservations": "Réservations",
  "/shopping": "Courses",
  "/converter": "Convertisseur",
  "/gallery": "Galerie",
  "/stats": "Statistiques",
  "/budget": "Budget",
  "/documents": "Documents",
  "/checklist": "Checklist départ",
  "/settings": "Paramètres",
};

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dayMatch = location.pathname.match(/^\/days\/(\d+)/);
  const title = dayMatch
    ? `Jour ${dayMatch[1]}`
    : TITLES[location.pathname] || (location.pathname === "/days" ? "Journées" : "Road Trip USA");

  return (
    <div className="app-shell">
      <div className={"app-overlay" + (open ? " open" : "")} onClick={() => setOpen(false)} />
      <aside className={"app-sidebar" + (open ? " open" : "")}>
        <SidebarNav onNavigate={() => setOpen(false)} />
      </aside>
      <div className="app-main">
        <TopBar onMenuClick={() => setOpen((o) => !o)} title={title} />
        <Outlet />
      </div>
    </div>
  );
}
