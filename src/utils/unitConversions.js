export const MI_TO_KM = 1.60934;
export const GAL_TO_L = 3.78541; // gallon US
export const LB_TO_KG = 0.453592;
export const FT_TO_M = 0.3048;
export const IN_TO_CM = 2.54;
export const ACRE_TO_HA = 0.404686;

export function fToC(f) {
  return ((f - 32) * 5) / 9;
}

export function cToF(c) {
  return (c * 9) / 5 + 32;
}

// MPG (US) <-> L/100km : relation inverse, même formule dans les deux sens
export function mpgToL100km(mpg) {
  return 235.214 / mpg;
}

export function l100kmToMpg(l100km) {
  return 235.214 / l100km;
}
