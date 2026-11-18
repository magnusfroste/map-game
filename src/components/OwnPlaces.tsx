import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileText, Download, Trash2 } from 'lucide-react';
import { parsePlaces, saveOwnPlaces, loadOwnPlaces, clearOwnPlaces, downloadSample, Place } from '@/lib/parsePlaces';

const OwnPlaces = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [label, setLabel] = useState('Egna platser');
  const [result, setResult] = useState<{ places: Place[]; problems: string[]; missing: string[] } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  const saved = loadOwnPlaces();

  /** Slår upp namn som saknas i det lokala registret via OpenStreetMap. */
  const lookupOnline = async () => {
    const names = result?.missing ?? [];
    if (names.length === 0) return;
    setNote('Slår upp ' + names.length + ' namn …');
    const found: Place[] = [];
    const still: string[] = [];
    for (let i = 0; i < names.length; i += 1) {
      const n = names[i];
      setBusy(n);
      try {
        const url =
          'https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=sv&q=' +
          encodeURIComponent(n);
        const r = await fetch(url, { headers: { Accept: 'application/json' } });
        const list = (await r.json()) as { lat: string; lon: string; display_name: string }[];
        if (list.length > 0) {
          found.push({
            id: 'egen-osm-' + i + '-' + n.toLowerCase().replace(/[^a-z0-9åäö]+/gi, '-'),
            name: n,
            category: 'Uppslag',
            lat: Number(list[0].lat),
            lng: Number(list[0].lon),
            tolerance: 8,
          });
        } else {
          still.push(n);
        }
      } catch {
        still.push(n);
      }
      await new Promise((res) => setTimeout(res, 1100));
    }
    setBusy(null);
    setResult((prev) =>
      prev ? { places: [...prev.places, ...found], problems: prev.problems, missing: still } : prev,
    );
    setNote(found.length + ' hittade, ' + still.length + ' kvar att fylla i själv');
  };

  const readFile = async (file: File) => {
    const raw = await file.text();
    setText(raw);
    if (!label || label === 'Egna platser') setLabel(file.name.replace(/\.[^.]+$/, ''));
    const parsed = parsePlaces(raw);
    setResult(parsed);
  };

  const parse = () => setResult(parsePlaces(text));

  const play = () => {
    const parsed = result ?? parsePlaces(text);
    if (parsed.places.length === 0) {
      setResult(parsed);
      return;
    }
    saveOwnPlaces(parsed.places, label || 'Egna platser');
    navigate('/quiz?own=1');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Egna platser
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ladda upp en textfil med platser (länder, städer, floder …) eller klistra in listan.
          Det räcker med namnen – koordinaterna slås upp lokalt i ett register med flera hundra
          platser, helt utan AI och utan nätverk. Filen stannar i webbläsaren.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Välj textfil
          </Button>
          <Button variant="ghost" onClick={downloadSample}>
            <Download className="mr-2 h-4 w-4" />
            Ladda ner exempel
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.csv,text/plain,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void readFile(f);
            }}
          />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={parse}
          placeholder={'Norge; 61.5; 8.5; Länder\nOslo; 59.91; 10.75; Huvudstäder'}
          rows={6}
          className="w-full rounded-md border bg-background p-3 font-mono text-sm"
        />

        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium">Namn på listan</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <Button variant="secondary" onClick={parse}>
            Tolka listan
          </Button>
        </div>

        {result && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={result.places.length > 0 ? 'default' : 'destructive'}>
                {result.places.length} platser
              </Badge>
              {result.missing.length > 0 && (
                <Badge variant="outline">{result.missing.length} namn saknas i registret</Badge>
              )}
              {result.problems.length > 0 && (
                <Badge variant="outline">{result.problems.length} rader med fel</Badge>
              )}
            </div>

            {result.places.length > 0 && (
              <ScrollArea className="max-h-48 rounded-md border">
                <ul className="divide-y text-sm">
                  {result.places.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 px-3 py-1.5">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-muted-foreground">
                        {p.lat.toFixed(2)}, {p.lng.toFixed(2)} · {p.category}
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}

            {result.problems.length > 0 && (
              <ul className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                {result.problems.slice(0, 5).map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}

            {result.missing.length > 0 && (
              <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3">
                <p className="text-sm font-medium">Namn som inte finns i registret:</p>
                <p className="mt-1 text-sm text-muted-foreground">{result.missing.join(', ')}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Skriv koordinater själv efter namnet (t.ex. <code>Himalaya; 28.0; 86.9</code>), eller
                  slå upp dem hos OpenStreetMap – då skickas bara namnen dit.
                </p>
                <Button size="sm" variant="outline" className="mt-2" onClick={lookupOnline} disabled={!!busy}>
                  {busy ? 'Slår upp ' + busy + ' …' : 'Slå upp via OpenStreetMap'}
                </Button>
                {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
              </div>
            )}

            <Button onClick={play} className="w-full" size="lg" disabled={result.places.length === 0}>
              Spara och spela med mina platser
            </Button>
          </div>
        )}

        {saved && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
            <span>
              Sparat i den här fliken: <strong>{saved.label}</strong> ({saved.places.length} platser)
            </span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => navigate('/quiz?own=1')}>Spela</Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  clearOwnPlaces();
                  window.location.reload();
                }}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Ta bort
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OwnPlaces;