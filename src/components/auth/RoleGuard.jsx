import { usePermissions } from "../../hooks/usePermissions";

// Cache `children` si le rôle courant n'est pas dans `allow`. Filtrage UI
// uniquement, pas une vraie barrière de sécurité.
export default function RoleGuard({ allow, children, fallback = null }) {
  const { role } = usePermissions();
  if (allow.includes(role)) return children;
  return fallback;
}
