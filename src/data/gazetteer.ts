import { allQuestions } from './allQuestions';

/** Platser som inte finns i frågebankarna men som dyker upp i skolans listor. */
interface Extra {
  name: string;
  lat: number;
  lng: number;
  category: string;
  alias?: string[];
}

export const EXTRA: Extra[] = [
  { name: 'Himalaya', lat: 28.0, lng: 86.9, category: 'Bergskedjor' },
  { name: 'Uralbergen', lat: 60.0, lng: 59.0, category: 'Bergskedjor' },
  { name: 'Alperna', lat: 46.5, lng: 10.0, category: 'Bergskedjor' },
  { name: 'Pyrenéerna', lat: 42.8, lng: 0.5, category: 'Bergskedjor' },
  { name: 'Karpaterna', lat: 47.5, lng: 24.0, category: 'Bergskedjor' },
  { name: 'Kaukasus', lat: 42.5, lng: 44.5, category: 'Bergskedjor' },
  { name: 'Altaj', lat: 49.0, lng: 89.0, category: 'Bergskedjor' },
  { name: 'Appalacherna', lat: 38.0, lng: -79.0, category: 'Bergskedjor' },
  { name: 'Atlasbergen', lat: 31.5, lng: -6.5, category: 'Bergskedjor' },
  { name: 'Karakoram', lat: 35.5, lng: 76.5, category: 'Bergskedjor' },
  { name: 'Mount Everest', lat: 27.99, lng: 86.93, category: 'Berg' },
  { name: 'K2', lat: 35.88, lng: 76.51, category: 'Berg' },
  { name: 'Kilimanjaro', lat: -3.07, lng: 37.35, category: 'Berg' },
  { name: 'Mont Blanc', lat: 45.83, lng: 6.86, category: 'Berg' },
  { name: 'Elbrus', lat: 43.35, lng: 42.44, category: 'Berg' },
  { name: 'Aconcagua', lat: -32.65, lng: -70.01, category: 'Berg' },
  { name: 'Fuji', lat: 35.36, lng: 138.73, category: 'Berg' },
  { name: 'Etna', lat: 37.75, lng: 14.99, category: 'Berg' },
  { name: 'Vesuvius', lat: 40.82, lng: 14.43, category: 'Berg' },
  { name: 'Hekla', lat: 63.98, lng: -19.7, category: 'Berg' },
  { name: 'Indiska oceanen', lat: -20.0, lng: 80.0, category: 'Hav' },
  { name: 'Stilla havet', lat: 0.0, lng: -160.0, category: 'Hav' },
  { name: 'Atlanten', lat: 20.0, lng: -40.0, category: 'Hav' },
  { name: 'Norra ishavet', lat: 82.0, lng: 0.0, category: 'Hav' },
  { name: 'Södra ishavet', lat: -65.0, lng: 0.0, category: 'Hav' },
  { name: 'Medelhavet', lat: 35.0, lng: 18.0, category: 'Hav' },
  { name: 'Östersjön', lat: 57.0, lng: 19.0, category: 'Hav' },
  { name: 'Nordsjön', lat: 56.0, lng: 3.0, category: 'Hav' },
  { name: 'Svarta havet', lat: 43.0, lng: 34.0, category: 'Hav' },
  { name: 'Röda havet', lat: 20.0, lng: 38.5, category: 'Hav' },
  { name: 'Kaspiska havet', lat: 41.5, lng: 51.0, category: 'Sjöar' },
  { name: 'Persiska viken', lat: 27.0, lng: 51.5, category: 'Hav' },
  { name: 'Bengaliska viken', lat: 15.0, lng: 88.0, category: 'Hav' },
  { name: 'Barents hav', lat: 73.0, lng: 40.0, category: 'Hav' },
  { name: 'Karibiska havet', lat: 15.0, lng: -75.0, category: 'Hav' },
  { name: 'Sargassohavet', lat: 30.0, lng: -60.0, category: 'Hav' },
  { name: 'Bering sund', lat: 65.8, lng: -169.0, category: 'Sund' },
  { name: 'Gibraltarsund', lat: 35.95, lng: -5.6, category: 'Sund' },
  { name: 'Bosporen', lat: 41.12, lng: 29.05, category: 'Sund' },
  { name: 'Suezkanalen', lat: 30.4, lng: 32.35, category: 'Kanaler' },
  { name: 'Kielkanalen', lat: 54.35, lng: 10.1, category: 'Kanaler' },
  { name: 'Nilen', lat: 26.0, lng: 32.0, category: 'Floder' },
  { name: 'Kongofloden', lat: -1.5, lng: 23.0, category: 'Floder' },
  { name: 'Niger', lat: 13.0, lng: 2.0, category: 'Floder' },
  { name: 'Zambezi', lat: -16.5, lng: 28.5, category: 'Floder' },
  { name: 'Indus', lat: 28.0, lng: 70.0, category: 'Floder' },
  { name: 'Ganges', lat: 25.5, lng: 83.0, category: 'Floder' },
  { name: 'Brahmaputra', lat: 26.0, lng: 92.0, category: 'Floder' },
  { name: 'Huang He', lat: 35.5, lng: 110.0, category: 'Floder' },
  { name: 'Yangtze', lat: 30.5, lng: 114.0, category: 'Floder', alias: ['Chang Jiang'] },
  { name: 'Mekong', lat: 15.5, lng: 105.0, category: 'Floder' },
  { name: 'Lena', lat: 64.0, lng: 126.0, category: 'Floder' },
  { name: 'Jenisej', lat: 62.0, lng: 90.0, category: 'Floder' },
  { name: 'Ob', lat: 60.0, lng: 74.0, category: 'Floder' },
  { name: 'Amur', lat: 49.0, lng: 133.0, category: 'Floder' },
  { name: 'Volga', lat: 50.0, lng: 45.0, category: 'Floder' },
  { name: 'Donau', lat: 45.0, lng: 22.0, category: 'Floder' },
  { name: 'Rhen', lat: 50.0, lng: 7.5, category: 'Floder' },
  { name: 'Elbe', lat: 52.5, lng: 12.5, category: 'Floder' },
  { name: 'Seine', lat: 48.85, lng: 2.35, category: 'Floder' },
  { name: 'Loire', lat: 47.5, lng: 0.5, category: 'Floder' },
  { name: 'Themsen', lat: 51.5, lng: -0.5, category: 'Floder' },
  { name: 'Ebro', lat: 41.5, lng: -0.5, category: 'Floder' },
  { name: 'Po', lat: 45.0, lng: 10.0, category: 'Floder' },
  { name: 'Dnjepr', lat: 49.0, lng: 33.0, category: 'Floder' },
  { name: 'Colorado', lat: 36.0, lng: -112.0, category: 'Floder' },
  { name: 'Orinoco', lat: 7.5, lng: -65.0, category: 'Floder' },
  { name: 'Paraná', lat: -29.0, lng: -59.5, category: 'Floder' },
  { name: 'Yukon', lat: 64.0, lng: -150.0, category: 'Floder' },
  { name: 'Mackenzie', lat: 66.0, lng: -126.0, category: 'Floder' },
  { name: 'Murray', lat: -34.5, lng: 141.0, category: 'Floder' },
  { name: 'Sahara', lat: 23.0, lng: 13.0, category: 'Öknar' },
  { name: 'Gobi', lat: 42.5, lng: 105.0, category: 'Öknar' },
  { name: 'Kalahari', lat: -23.0, lng: 22.0, category: 'Öknar' },
  { name: 'Namib', lat: -23.0, lng: 15.0, category: 'Öknar' },
  { name: 'Arabiska öknen', lat: 23.0, lng: 46.0, category: 'Öknar' },
  { name: 'Atacama', lat: -23.5, lng: -69.0, category: 'Öknar' },
  { name: 'Thar', lat: 27.0, lng: 71.0, category: 'Öknar' },
  { name: 'Bajkalsjön', lat: 53.5, lng: 108.0, category: 'Sjöar' },
  { name: 'Viktoria­sjön', lat: -1.0, lng: 33.0, category: 'Sjöar', alias: ['Victoriasjön', 'Victoriasjön'] },
  { name: 'Tanganyikasjön', lat: -6.0, lng: 29.5, category: 'Sjöar' },
  { name: 'Malawisjön', lat: -12.0, lng: 34.5, category: 'Sjöar' },
  { name: 'Aralsjön', lat: 45.0, lng: 59.0, category: 'Sjöar' },
  { name: 'Vänern', lat: 58.9, lng: 13.2, category: 'Sjöar' },
  { name: 'Vättern', lat: 58.3, lng: 14.5, category: 'Sjöar' },
  { name: 'Grönland', lat: 72.0, lng: -40.0, category: 'Öar' },
  { name: 'Madagaskar', lat: -19.0, lng: 46.8, category: 'Öar' },
  { name: 'Nya Zeeland', lat: -41.5, lng: 172.8, category: 'Länder' },
  { name: 'Borneo', lat: 0.5, lng: 114.0, category: 'Öar' },
  { name: 'Sumatra', lat: -0.5, lng: 102.0, category: 'Öar' },
  { name: 'Java', lat: -7.3, lng: 110.0, category: 'Öar' },
  { name: 'Sri Lanka', lat: 7.6, lng: 80.7, category: 'Öar' },
  { name: 'Island', lat: 65.0, lng: -18.0, category: 'Länder' },
  { name: 'Irland', lat: 53.2, lng: -8.0, category: 'Länder' },
  { name: 'Sicilien', lat: 37.5, lng: 14.2, category: 'Öar' },
  { name: 'Sardinien', lat: 40.1, lng: 9.0, category: 'Öar' },
  { name: 'Korsika', lat: 42.1, lng: 9.1, category: 'Öar' },
  { name: 'Kreta', lat: 35.2, lng: 24.9, category: 'Öar' },
  { name: 'Cypern', lat: 35.1, lng: 33.2, category: 'Länder' },
  { name: 'Sibirien', lat: 62.0, lng: 100.0, category: 'Regioner' },
  { name: 'Skandinavien', lat: 63.0, lng: 14.0, category: 'Regioner' },
  { name: 'Iberiska halvön', lat: 40.2, lng: -3.7, category: 'Regioner' },
  { name: 'Balkan', lat: 42.5, lng: 22.0, category: 'Regioner' },
  { name: 'Sahel', lat: 15.0, lng: 5.0, category: 'Regioner' },
  { name: 'Mellanöstern', lat: 29.0, lng: 43.0, category: 'Regioner' },
  { name: 'Amazonas', lat: -4.0, lng: -63.0, category: 'Regioner' },
  { name: 'Antarktis', lat: -75.0, lng: 0.0, category: 'Regioner' },
  { name: 'Arktis', lat: 85.0, lng: 0.0, category: 'Regioner' },
];

/** Plats med koordinater, som den ser ut i uppslagningen. */
export interface FoundPlace {
  name: string;
  lat: number;
  lng: number;
  category: string;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9åäöé]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Tar bort vanliga ändelser så att "Amazonasfloden" matchar "Amazonas". */
const key = (s: string) => {
  const n = norm(s)
    .replace(/\b(floden|flod|älven|alven|sjön|sjon|havet|hav|oceanen|ocean|bergen|berget|bergskedjan)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return n.length > 0 ? n : norm(s);
};

let index: Map<string, FoundPlace> | null = null;

const buildIndex = () => {
  const map = new Map<string, FoundPlace>();
  const add = (name: string, lat: number, lng: number, category: string) => {
    const entry: FoundPlace = { name: name.trim(), lat, lng, category };
    const k = key(name);
    if (k && !map.has(k)) map.set(k, entry);
  };
  for (const q of allQuestions) add(q.name, q.lat, q.lng, q.category);
  for (const e of EXTRA) {
    add(e.name, e.lat, e.lng, e.category);
    for (const a of e.alias ?? []) add(a, e.lat, e.lng, e.category);
  }
  index = map;
  return map;
};

/** Slår upp ett namn helt lokalt – ingen AI, inget nätverk. */
export function lookupPlace(name: string): FoundPlace | null {
  const map = index ?? buildIndex();
  const k1 = key(name);
  if (k1 && map.has(k1)) return map.get(k1)!;
  const k2 = norm(name);
  if (k2 && map.has(k2)) return map.get(k2)!;
  const k3 = key(name.replace(/^(mount|floden|sjön|havet|berget)\s+/i, ''));
  if (k3 && map.has(k3)) return map.get(k3)!;
  return null;
}