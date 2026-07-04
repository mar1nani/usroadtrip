import { C } from "../styles/theme";
import LinearConverter from "../components/converter/LinearConverter";
import CurrencyConverter from "../components/converter/CurrencyConverter";
import {
  MI_TO_KM,
  GAL_TO_L,
  LB_TO_KG,
  FT_TO_M,
  IN_TO_CM,
  ACRE_TO_HA,
  fToC,
  cToF,
  mpgToL100km,
  l100kmToMpg,
} from "../utils/unitConversions";

export default function ConverterPage() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>
      <div style={{ fontSize: 18, color: C.gold, fontWeight: 700, marginBottom: 4 }}>🔄 Convertisseur</div>
      <div style={{ fontSize: 12, color: C.dim, marginBottom: 16 }}>
        Fonctionne hors-ligne, aucune donnée réseau requise.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
        <LinearConverter title="Distance" unitA="Miles (mi)" unitB="Kilomètres (km)" toB={(mi) => mi * MI_TO_KM} toA={(km) => km / MI_TO_KM} />
        <LinearConverter title="Vitesse" unitA="mph" unitB="km/h" toB={(mph) => mph * MI_TO_KM} toA={(kmh) => kmh / MI_TO_KM} />
        <LinearConverter title="Température" unitA="°F" unitB="°C" toB={fToC} toA={cToF} />
        <LinearConverter title="Volume" unitA="Gallons (US)" unitB="Litres" toB={(g) => g * GAL_TO_L} toA={(l) => l / GAL_TO_L} />
        <LinearConverter title="Poids" unitA="Pounds (lb)" unitB="Kilogrammes (kg)" toB={(lb) => lb * LB_TO_KG} toA={(kg) => kg / LB_TO_KG} />
        <LinearConverter title="Longueur" unitA="Feet (ft)" unitB="Mètres (m)" toB={(ft) => ft * FT_TO_M} toA={(m) => m / FT_TO_M} />
        <LinearConverter title="Longueur (petite)" unitA="Inches (in)" unitB="Centimètres (cm)" toB={(inch) => inch * IN_TO_CM} toA={(cm) => cm / IN_TO_CM} />
        <LinearConverter title="Surface" unitA="Acres" unitB="Hectares" toB={(ac) => ac * ACRE_TO_HA} toA={(ha) => ha / ACRE_TO_HA} />
        <LinearConverter title="Consommation" unitA="MPG (US)" unitB="L/100km" toB={mpgToL100km} toA={l100kmToMpg} />
        <CurrencyConverter />
      </div>
    </div>
  );
}
