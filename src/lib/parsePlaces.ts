import type { GeographyQuestion } from '@/data/geographyQuestions';

export interface Place extends GeographyQuestion {}

const SESSION_KEY = 'karttest:egna-platser';

/** Exempel som går att ladda ner som mall. */
export const SAMPLE = `# Egna platser – en plats per rad
# format: namn; latitud; longitud; kategori (kategori är frivillig)
Norge; 61.5; 8.5; Länder
Oslo; 59.91; 10.75; Huvudstäder
Rio Grande; 29.0; -104.0; Floder
Kilimanjaro; -3.07; 37.35; Berg

# Andra format som också funkar:
#   Paris, 48.85, 2.35
#   Paris 48.85 2.35
#   Paris | 48.85 | 2.35 | Städer
`;

const clean = (s: string) => s.trim().replace(/^["']|["']$/g, '').trim();

const toNum = (s: string): number | null => {
  const t = s.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};

/**
 * Tolkar en enkel textfil helt lokalt, utan AI och utan nätverk.
 * Första fältet är namnet, därefter två tal (latitud, longitud) i valfri
 * ordning – det som ligger inom -90..90 räknas som latitud. Ett sista
 * textfält blir kategori. Semikolon, komma, pipe och tab fungerar som
 * avgränsare, och blanksteg mellan namnet och talen går också bra.
 */
export function parsePlaces(text: string, fallbackCategory = 'Egna platser') {
  const places: Place[] = [];
  const problems: string[] = [];

  text.split(/\r?\n/).forEach((rawLine, i) => {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) return;

    let fields = line.split(/\s*[;|\t]\s*/).map(clean).filter((f) => f.length > 0);
    if (fields.length < 3) fields = line.split(/\s*,\s*/).map(clean).filter(Boolean);
    if (fields.length < 3) {
      // "Namn 59.91 10.75", "New York 40.7 -74.0" och "Kilimanjaro -3.07 37.35 Berg"
      const parts = line.split(/\s+/);
      const isNum = (t: string) => toNum(t) !== null;
      const firstNum = parts.findIndex(isNum);
      if (firstNum > 0) {
        const numsInLine = parts.filter(isNum);
        const wordsBefore = parts.slice(0, firstNum);
        const wordsAfter = parts.slice(firstNum).filter((t) => !isNum(t));
        if (numsInLine.length >= 2) {
          fields = [wordsBefore.join(' '), numsInLine[0], numsInLine[1]];
          if (wordsAfter.length > 0) fields.push(wordsAfter[wordsAfter.length - 1]);
        }
      }
    }

    if (fields.length < 3) {
      problems.push(`rad ${i + 1}: hittar inte namn + två koordinater`);
      return;
    }

    const name = fields[0];
    const nums = fields.slice(1).map(toNum).filter((n): n is number => n !== null);
    if (nums.length < 2) {
      problems.push(`rad ${i + 1}: "${name}" saknar giltiga koordinater`);
      return;
    }

    const latFirst = Math.abs(nums[0]) <= 90;
    const lat = latFirst ? nums[0] : nums[1];
    const lng = latFirst ? nums[1] : nums[0];
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      problems.push(`rad ${i + 1}: "${name}" har koordinater utanför kartan`);
      return;
    }

    const categoryField = fields
      .slice(1)
      .find((f) => toNum(f) === null && f.length > 0 && f !== name && !/^-?\d+(\.\d+)?$/.test(f));
    const category = categoryField ? clean(categoryField) : fallbackCategory;

    places.push({
      id: `egen-${places.length}-${name.toLowerCase().replace(/[^a-z0-9åäö]+/gi, '-')}`,
      name,
      category,
      lat,
      lng,
      tolerance: 8,
    });
  });

  return { places, problems };
}

export function saveOwnPlaces(places: Place[], label: string) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ places, label }));
  } catch {
    /* sessionStorage kan vara avstängt – då lever platserna bara i minnet */
  }
}

export function loadOwnPlaces(): { places: Place[]; label: string } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.places) && parsed.places.length > 0) return parsed;
  } catch {
    /* ignorera trasig data */
  }
  return null;
}

export function clearOwnPlaces() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* noop */
  }
}

export function downloadSample() {
  const blob = new Blob([SAMPLE], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'egna-platser.txt';
  a.click();
  URL.revokeObjectURL(url);
}