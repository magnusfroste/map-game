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
  const [result, setResult] = useState<{ places: Place[]; problems: string[] } | null>(null);
  const saved = loadOwnPlaces();

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
          Filen tolkas direkt i webbläsaren – inget skickas någonstans och du behöver inget konto.
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
            <div className="flex items-center gap-2">
              <Badge variant={result.places.length > 0 ? 'default' : 'destructive'}>
                {result.places.length} platser
              </Badge>
              {result.problems.length > 0 && (
                <Badge variant="outline">{result.problems.length} rader hoppades över</Badge>
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