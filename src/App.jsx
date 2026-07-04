import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/AuthContext";
import AppShell from "./components/layout/AppShell";
import HomePage from "./pages/HomePage";
import ChicagoPreTripPage from "./pages/ChicagoPreTripPage";
import DaysPage from "./pages/DaysPage";
import DayPage from "./pages/DayPage";
import ReservationsPage from "./pages/ReservationsPage";
import ShoppingPage from "./pages/ShoppingPage";
import ConverterPage from "./pages/ConverterPage";
import SettingsPage from "./pages/SettingsPage";
import GalleryPage from "./pages/StubPage";
import StatisticsPage from "./pages/StatisticsPage";
import BudgetPage from "./pages/BudgetPage";
import DocumentsPage from "./pages/DocumentsPage";
import DepartureChecklistPage from "./pages/DepartureChecklistPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chicago" element={<ChicagoPreTripPage />} />
          <Route path="/days" element={<DaysPage />} />
          <Route path="/days/:dayNumber" element={<DayPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/converter" element={<ConverterPage />} />
          <Route path="/gallery" element={<GalleryPage title="Galerie" icon="📸" />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/checklist" element={<DepartureChecklistPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
