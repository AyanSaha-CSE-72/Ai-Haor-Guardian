// Small mapping of country ISO codes (CCA2) to some common regions/states
// country code -> list of notable wetland locations / haors / marshes etc.
export const regionsMap: Record<string, string[]> = {
  US: ['Everglades', 'Chesapeake Bay Marshes', 'Okefenokee Swamp', 'Mississippi Delta Wetlands'],
  IN: ['Sundarbans', 'Chilika Lake', 'Keoladeo National Park', 'Kolleru Lake'],
  BD: ['Sundarbans', 'Hakaluki Haor', 'Tanguar Haor', 'Ghorashal Haor', 'Hatiya Char Wetlands'],
  GB: ['The Broads (Norfolk & Suffolk)', 'Severn Estuary Marshes', 'Skomer Wetlands'],
  CA: ['Point Pelee Marshes', 'Lake St. Clair Wetlands', 'Fraser River Delta'],
  IN: ['Chengalpattu Marshes'],
};

export default regionsMap;
