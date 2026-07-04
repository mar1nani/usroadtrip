// Calcule la bounding box d'un chemin SVG composé uniquement de commandes
// M/L (lignes droites, pas de courbes/arcs) — c'est le cas de src/data/states.json.
export function pathBoundingBox(d) {
  const coords = [...d.matchAll(/[ML]\s*(-?[\d.]+)[,\s]+(-?[\d.]+)/g)];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [, xStr, yStr] of coords) {
    const x = parseFloat(xStr);
    const y = parseFloat(yStr);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}
