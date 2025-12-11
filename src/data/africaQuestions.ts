import type { GeographyQuestion } from './geographyQuestions';

export const africaQuestions: GeographyQuestion[] = [
  // Länder och huvudstäder
  { id: 'af1', name: 'Egypten', category: 'Länder', lat: 26.8206, lng: 30.8025, tolerance: 200 },
  { id: 'af2', name: 'Kairo', category: 'Huvudstäder', lat: 30.0444, lng: 31.2357, tolerance: 50 },
  { id: 'af3', name: 'Sydafrika', category: 'Länder', lat: -30.5595, lng: 22.9375, tolerance: 200 },
  { id: 'af4', name: 'Pretoria', category: 'Huvudstäder', lat: -25.7479, lng: 28.2293, tolerance: 50 },
  { id: 'af5', name: 'Nigeria', category: 'Länder', lat: 9.0820, lng: 8.6753, tolerance: 200 },
  { id: 'af6', name: 'Abuja', category: 'Huvudstäder', lat: 9.0765, lng: 7.3986, tolerance: 50 },
  { id: 'af7', name: 'Kenya', category: 'Länder', lat: -0.0236, lng: 37.9062, tolerance: 150 },
  { id: 'af8', name: 'Nairobi', category: 'Huvudstäder', lat: -1.2921, lng: 36.8219, tolerance: 50 },
  { id: 'af9', name: 'Etiopien', category: 'Länder', lat: 9.1450, lng: 40.4897, tolerance: 200 },
  { id: 'af10', name: 'Addis Abeba', category: 'Huvudstäder', lat: 9.0320, lng: 38.7469, tolerance: 50 },
  { id: 'af11', name: 'Marocko', category: 'Länder', lat: 31.7917, lng: -7.0926, tolerance: 150 },
  { id: 'af12', name: 'Rabat', category: 'Huvudstäder', lat: 34.0209, lng: -6.8416, tolerance: 50 },
  { id: 'af13', name: 'Algeriet', category: 'Länder', lat: 28.0339, lng: 1.6596, tolerance: 300 },
  { id: 'af14', name: 'Alger', category: 'Huvudstäder', lat: 36.7538, lng: 3.0588, tolerance: 50 },
  { id: 'af15', name: 'Ghana', category: 'Länder', lat: 7.9465, lng: -1.0232, tolerance: 100 },
  { id: 'af16', name: 'Accra', category: 'Huvudstäder', lat: 5.6037, lng: -0.1870, tolerance: 50 },
  { id: 'af17', name: 'Tanzania', category: 'Länder', lat: -6.3690, lng: 34.8888, tolerance: 200 },
  { id: 'af18', name: 'Dodoma', category: 'Huvudstäder', lat: -6.1630, lng: 35.7516, tolerance: 50 },
  { id: 'af19', name: 'Kongo-Kinshasa', category: 'Länder', lat: -4.0383, lng: 21.7587, tolerance: 300 },
  { id: 'af20', name: 'Kinshasa', category: 'Huvudstäder', lat: -4.4419, lng: 15.2663, tolerance: 50 },
  { id: 'af21', name: 'Tunisien', category: 'Länder', lat: 33.8869, lng: 9.5375, tolerance: 100 },
  { id: 'af22', name: 'Tunis', category: 'Huvudstäder', lat: 36.8065, lng: 10.1815, tolerance: 50 },
  { id: 'af23', name: 'Libyen', category: 'Länder', lat: 26.3351, lng: 17.2283, tolerance: 300 },
  { id: 'af24', name: 'Tripoli', category: 'Huvudstäder', lat: 32.8872, lng: 13.1913, tolerance: 50 },

  // Floder
  { id: 'af25', name: 'Nilen', category: 'Floder', lat: 25.6872, lng: 32.6396, tolerance: 150 },
  { id: 'af26', name: 'Kongofloden', category: 'Floder', lat: -4.3833, lng: 15.2833, tolerance: 150 },
  { id: 'af27', name: 'Niger', category: 'Floder', lat: 11.5000, lng: 4.0000, tolerance: 150 },
  { id: 'af28', name: 'Zambezi', category: 'Floder', lat: -17.9244, lng: 25.8567, tolerance: 150 },

  // Sjöar
  { id: 'af29', name: 'Victoriasjön', category: 'Sjöar', lat: -1.0000, lng: 33.0000, tolerance: 150 },
  { id: 'af30', name: 'Tanganyikasjön', category: 'Sjöar', lat: -6.0000, lng: 29.5000, tolerance: 100 },
  { id: 'af31', name: 'Malawisjön', category: 'Sjöar', lat: -12.0000, lng: 34.5000, tolerance: 100 },

  // Berg
  { id: 'af32', name: 'Kilimanjaro', category: 'Berg', lat: -3.0674, lng: 37.3556, tolerance: 50 },
  { id: 'af33', name: 'Mount Kenya', category: 'Berg', lat: -0.1521, lng: 37.3084, tolerance: 50 },
  { id: 'af34', name: 'Atlasbergen', category: 'Bergskedjor', lat: 31.0000, lng: -7.0000, tolerance: 200 },
  { id: 'af35', name: 'Drakensbergen', category: 'Bergskedjor', lat: -29.0000, lng: 29.5000, tolerance: 150 },

  // Öknar
  { id: 'af36', name: 'Sahara', category: 'Öknar', lat: 23.4162, lng: 12.5000, tolerance: 400 },
  { id: 'af37', name: 'Kalahari', category: 'Öknar', lat: -23.0000, lng: 22.0000, tolerance: 200 },
  { id: 'af38', name: 'Namiböknen', category: 'Öknar', lat: -24.0000, lng: 15.5000, tolerance: 150 },

  // Hav och vikar
  { id: 'af39', name: 'Röda havet', category: 'Hav', lat: 20.0000, lng: 38.0000, tolerance: 200 },
  { id: 'af40', name: 'Guineabukten', category: 'Hav', lat: 3.0000, lng: 3.0000, tolerance: 200 },
  { id: 'af41', name: 'Kap det goda hoppet', category: 'Landmärken', lat: -34.3568, lng: 18.4740, tolerance: 50 },
  { id: 'af42', name: 'Madagaskar', category: 'Öar', lat: -18.7669, lng: 46.8691, tolerance: 200 },
];
