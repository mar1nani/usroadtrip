export const US_STATE_NAMES = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "Californie",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District de Columbia",
  FL: "Floride", GA: "Géorgie", ID: "Idaho", IL: "Illinois", IN: "Indiana",
  IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiane", ME: "Maine",
  MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska",
  NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "Nouveau-Mexique",
  NY: "New York", NC: "Caroline du Nord", ND: "Dakota du Nord", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvanie", RI: "Rhode Island",
  SC: "Caroline du Sud", SD: "Dakota du Sud", TN: "Tennessee", TX: "Texas",
  UT: "Utah", VT: "Vermont", VA: "Virginie", WA: "Washington",
  WV: "Virginie-Occidentale", WI: "Wisconsin", WY: "Wyoming",
};

export function usStateName(ab) {
  return US_STATE_NAMES[ab] || ab;
}
