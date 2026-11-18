import { useEffect, useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import worldTopo from 'world-atlas/countries-110m.json';
import type { GeographyQuestion } from '@/data/geographyQuestions';

/** Kartvy per världsdel: [[väst, syd], [öst, nord]] i grader. */
export const VIEWS: Record<string, [[number, number], [number, number]]> = {
  amerika: [[-168, -56], [-32, 72]],
  europa: [[-25, 34], [46, 71]],
  afrika: [[-19, -35], [52, 37]],
  asien: [[24, -11], [148, 60]],
  alla: [[-178, -58], [178, 82]],
  custom: [[-178, -58], [178, 82]],
};

interface Props {
  questions: GeographyQuestion[];
  correctId?: string | null;
  pickedId?: string | null;
  reveal?: boolean;
  view: string;
  onPick: (q: GeographyQuestion) => void;
}

const PAD = 18;

const MapCanvas = ({ questions, correctId, pickedId, reveal, view, onPick }: Props) => {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 560 });
  const [zoom, setZoom] = useState(1);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    if (!box.current) return;
    const el = box.current;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.max(320, Math.round(r.width)), h: Math.max(280, Math.round(r.height)) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const land = useMemo(() => {
    const topo = worldTopo as any;
    return feature(topo, topo.objects.countries as any) as any;
  }, []);

  const { path, project } = useMemo(() => {
    const [[w, s], [e, n]] = VIEWS[view] ?? VIEWS.alla;
    const proj = geoMercator().fitExtent(
      [[PAD, PAD], [size.w - PAD, size.h - PAD]],
      { type: 'MultiPoint', coordinates: [[w, n], [e, s]] } as any,
    );
    return { path: geoPath(proj), project: proj };
  }, [view, size]);

  const zoomed = useMemo(() => {
    const cx = size.w / 2;
    const cy = size.h / 2;
    return `translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})`;
  }, [size, zoom]);

  const pinR = 7 / zoom;

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden bg-[#dfeaf1]">
      <svg width={size.w} height={size.h} className="block touch-manipulation select-none">
        <g transform={zoomed}>
          <rect width={size.w} height={size.h} fill="#dfeaf1" />
          {land.features.map((f: any, i: number) => (
            <path key={i} d={path(f) ?? ''} fill="#f7f5ef" stroke="#cbc3b4" strokeWidth={0.6 / zoom} />
          ))}
          {questions.map((q) => {
            const p = project([q.lng, q.lat]);
            if (!p) return null;
            const [x, y] = p;
            const isCorrect = !!reveal && q.id === correctId;
            const isPicked = !!reveal && q.id === pickedId && q.id !== correctId;
            const isHover = hover === q.id;
            const fill = isCorrect ? '#16a34a' : isPicked ? '#b91c1c' : isHover ? '#1d4ed8' : '#3b82f6';
            const base = isCorrect || isPicked || isHover ? pinR + 2.5 : pinR;
            return (
              <g
                key={q.id}
                transform={`translate(${x} ${y})`}
                style={{ cursor: 'pointer' }}
                onPointerEnter={() => setHover(q.id)}
                onPointerLeave={() => setHover(null)}
                onClick={() => onPick(q)}
              >
                <circle r={pinR + 6 / zoom} fill="transparent" />
                <circle r={base} fill={fill} stroke="#fff" strokeWidth={2 / zoom} pointerEvents="none" />
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute right-3 top-3 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(4, z * 1.5))}
          className="h-9 w-9 rounded-md border bg-white/95 text-lg font-bold leading-none text-slate-700 shadow-sm active:scale-95"
          aria-label="Zooma in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(1, z / 1.5))}
          className="h-9 w-9 rounded-md border bg-white/95 text-lg font-bold leading-none text-slate-700 shadow-sm active:scale-95"
          aria-label="Zooma ut"
        >
          −
        </button>
      </div>
    </div>
  );
};

export default MapCanvas;