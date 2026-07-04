import { useAuth } from "./AuthContext";
import { roleForUser } from "../utils/roles";

// Filtrage UI uniquement (pas de vraie sécurité serveur) — voir le plan.
export function usePermissions() {
  const { user } = useAuth();
  const role = roleForUser(user);
  const isGuest = role === "guest";

  return {
    role,
    scope: isGuest ? "shared" : role, // "marouane" | "isabelle" | "shared" (invité)
    canSeeBudget: !isGuest,
    canSeeReservations: !isGuest,
    canSeeFlights: !isGuest,
    canSeeSettings: !isGuest,
    canSeeDocuments: !isGuest,
    canEdit: !isGuest,
  };
}
