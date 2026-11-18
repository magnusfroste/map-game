import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { GeographyQuestion } from '@/data/geographyQuestions';
import MapCanvas from '@/components/MapCanvas';

interface Props {
  places: GeographyQuestion[];
  view: string;
}

/** Studera-läge: alla platser syns med namn, ingen poäng, ingen tid. */
const StudyView = ({ places, view }: Props) => {
  const [selected, setSelected] = useState<GeographyQuestion | null>(null);

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="relative min-h-[420px] flex-1">
        <MapCanvas
          questions={places}
          view={view}
          onPick={(q) => setSelected(q)}
          labels
          selectedId={selected?.id ?? null}
        />

        {selected && (
          <div className="absolute bottom-4 left-1/2 z-10 w-[min(92%,26rem)] -translate-x-1/2 rounded-xl border bg-card p-3 text-center shadow-lg">
            <p className="text-lg font-bold">{selected.name}</p>
            <p className="text-sm text-muted-foreground">
              {selected.category} · {selected.lat.toFixed(2)}, {selected.lng.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <aside className="w-full border-t bg-card lg:w-72 lg:border-l lg:border-t-0">
        <div className="border-b px-4 py-2 text-sm font-semibold">
          {places.length} platser
        </div>
        <ScrollArea className="h-40 lg:h-[calc(100vh-11rem)]">
          <ul className="divide-y">
            {places.map((q) => (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => setSelected(q)}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm hover:bg-muted ${
                    selected?.id === q.id ? 'bg-muted font-semibold' : ''
                  }`}
                >
                  <span>{q.name}</span>
                  <Badge variant="outline" className="shrink-0 text-[10px]">{q.category}</Badge>
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </aside>
    </div>
  );
};

export default StudyView;