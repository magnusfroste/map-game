// Geografiska platser från bilden för karttest
export interface GeographyQuestion {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  tolerance: number; // Tolerans i grader för att svaret ska räknas som rätt
}

export const americaQuestions: GeographyQuestion[] = [
  // Land + Huvudstäder
  { id: 'usa', name: 'USA', category: 'Land + Huvudstad', lat: 39.8283, lng: -98.5795, tolerance: 8 },
  { id: 'canada', name: 'Kanada', category: 'Land + Huvudstad', lat: 56.1304, lng: -106.3468, tolerance: 8 },
  { id: 'mexico', name: 'Mexiko', category: 'Land + Huvudstad', lat: 23.6345, lng: -102.5528, tolerance: 5 },
  { id: 'kuba', name: 'Kuba', category: 'Land + Huvudstad', lat: 21.5218, lng: -77.7812, tolerance: 3 },
  { id: 'haiti', name: 'Haiti', category: 'Land + Huvudstad', lat: 18.9712, lng: -72.2852, tolerance: 2 },
  { id: 'brasilien', name: 'Brasilien', category: 'Land + Huvudstad', lat: -14.2350, lng: -51.9253, tolerance: 8 },
  { id: 'argentina', name: 'Argentina', category: 'Land + Huvudstad', lat: -38.4161, lng: -63.6167, tolerance: 6 },
  { id: 'chile', name: 'Chile', category: 'Land + Huvudstad', lat: -35.6751, lng: -71.5430, tolerance: 4 },
  { id: 'colombia', name: 'Colombia', category: 'Land + Huvudstad', lat: 4.5709, lng: -74.2973, tolerance: 4 },
  { id: 'peru', name: 'Peru', category: 'Land + Huvudstad', lat: -9.1900, lng: -75.0152, tolerance: 4 },
  { id: 'costa_rica', name: 'Costa Rica', category: 'Land + Huvudstad', lat: 9.7489, lng: -83.7534, tolerance: 2 },

  // Floder
  { id: 'mississippi', name: 'Mississippifloden', category: 'Floder', lat: 32.3547, lng: -91.3985, tolerance: 5 },
  { id: 'missouri', name: 'Missourifloden', category: 'Floder', lat: 38.5767, lng: -92.1735, tolerance: 5 },
  { id: 'amazonas', name: 'Amazonasfloden', category: 'Floder', lat: -3.4653, lng: -62.2159, tolerance: 6 },
  { id: 'rio_grande', name: 'Rio Grande', category: 'Floder', lat: 26.0700, lng: -97.1500, tolerance: 4 },

  // Sjöar
  { id: 'great_lakes', name: 'The Great Lakes', category: 'Sjöar', lat: 45.0000, lng: -84.0000, tolerance: 4 },
  { id: 'titicaca', name: 'Titicacasjön', category: 'Sjöar', lat: -15.8422, lng: -69.3658, tolerance: 2 },

  // Bergskedjor
  { id: 'klippiga_bergen', name: 'Klippiga bergen', category: 'Bergskedjor', lat: 50.0000, lng: -114.0000, tolerance: 6 },
  { id: 'anderna', name: 'Anderna', category: 'Bergskedjor', lat: -13.1631, lng: -72.5450, tolerance: 8 },
  { id: 'mount_mckinley', name: 'Mount McKinley', category: 'Bergskedjor', lat: 63.0692, lng: -151.0070, tolerance: 3 },

  // Öar
  { id: 'falkland', name: 'Falklandsöarna', category: 'Öar', lat: -51.7963, lng: -59.5236, tolerance: 2 },
  { id: 'hawaii', name: 'Hawaii', category: 'Öar', lat: 21.3099, lng: -157.8581, tolerance: 2 },

  // Städer
  { id: 'washington', name: 'Washington', category: 'Städer', lat: 38.9072, lng: -77.0369, tolerance: 2 },
  { id: 'havanna', name: 'Havanna', category: 'Städer', lat: 23.1136, lng: -82.3666, tolerance: 2 },
  { id: 'mexico_city', name: 'Mexico City', category: 'Städer', lat: 19.4326, lng: -99.1332, tolerance: 2 },
  { id: 'los_angeles', name: 'Los Angeles', category: 'Städer', lat: 34.0522, lng: -118.2437, tolerance: 2 },
  { id: 'chicago', name: 'Chicago', category: 'Städer', lat: 41.8781, lng: -87.6298, tolerance: 2 },
  { id: 'new_york', name: 'New York', category: 'Städer', lat: 40.7128, lng: -74.0060, tolerance: 2 },
  { id: 'buenos_aires', name: 'Buenos Aires', category: 'Städer', lat: -34.6118, lng: -58.3960, tolerance: 2 },
  { id: 'brasilia', name: 'Brasilia', category: 'Städer', lat: -15.8267, lng: -47.9218, tolerance: 2 },
  { id: 'rio_de_janeiro', name: 'Rio de Janeiro', category: 'Städer', lat: -22.9068, lng: -43.1729, tolerance: 2 },
  { id: 'santiago', name: 'Santiago de Chile', category: 'Städer', lat: -33.4489, lng: -70.6693, tolerance: 2 },

  // Kanaler
  { id: 'panama', name: 'Panamakanalen', category: 'Kanaler', lat: 9.0800, lng: -79.6800, tolerance: 1 },

  // Uddar
  { id: 'kap_horn', name: 'Kap Horn', category: 'Uddar', lat: -55.9800, lng: -67.2700, tolerance: 2 },

  // Hav
  { id: 'atlanten', name: 'Atlanten', category: 'Hav', lat: 14.5994, lng: -28.6731, tolerance: 15 },
  { id: 'stilla_havet', name: 'Stilla havet', category: 'Hav', lat: 8.7832, lng: -124.5085, tolerance: 15 },
  { id: 'karibiska_havet', name: 'Karibiska havet', category: 'Hav', lat: 15.2539, lng: -73.1250, tolerance: 8 },
  { id: 'mexikanska_golfen', name: 'Mexikanska golfen', category: 'Hav', lat: 25.0000, lng: -90.0000, tolerance: 6 }
];

export const geographyQuestions = americaQuestions; // Keep for backward compatibility
export const categories = Array.from(new Set(geographyQuestions.map(q => q.category)));