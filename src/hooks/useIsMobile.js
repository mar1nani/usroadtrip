import { useEffect, useState } from "react";

const QUERY = "(max-width: 768px)";

// Bascule de mise en page (ex: carte en premier sur mobile, tuiles en premier
// sur desktop) — pas de media query CSS possible avec des styles inline, donc
// on détecte le point de rupture en JS.
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
