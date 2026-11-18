import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, RotateCcw, RefreshCw } from 'lucide-react';
import type { GeographyQuestion } from '@/data/geographyQuestions';
import { Continent, continentLabels } from '@/data/allQuestions';
import MapCanvas from '@/components/MapCanvas';

interface Props {
  questions: GeographyQuestion[];
  continent?: Continent;
}

const Karttest = ({ questions, continent = 'amerika' }: Props) => {
  const navigate = useNavigate();

  const categories = useMemo(() => [...new Set(questions.map((q) => q.category))], [questions]);
  const [selectedCategory, setSelectedCategory] = useState('Alla');
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState<GeographyQuestion | null>(null);
  const [picked, setPicked] = useState<GeographyQuestion | null>(null);
  const [wrong, setWrong] = useState<GeographyQuestion[]>([]);
  const [practice, setPractice] = useState<GeographyQuestion[] | null>(null);

  const pool = practice ?? questions;
  const visiblePins = useMemo(
    () => pool.filter((q) => selectedCategory === 'Alla' || q.category === selectedCategory),
    [pool, selectedCategory],
  );
  const total = visiblePins.length;

  const nextQuestion = () => {
    const left = visiblePins.filter((q) => !used.has(q.id));
    if (left.length === 0) {
      setCurrent(null);
      return;
    }
    setCurrent(left[Math.floor(Math.random() * left.length)]);
    setPicked(null);
  };

  const start = () => {
    const left = questions.filter((q) => selectedCategory === 'Alla' || q.category === selectedCategory);
    setStarted(true);
    setScore(0);
    setAnswered(0);
    setUsed(new Set());
    setWrong([]);
    setPractice(null);
    setPicked(null);
    setCurrent(left[Math.floor(Math.random() * left.length)] ?? null);
  };

  const pick = (q: GeographyQuestion) => {
    if (!current || picked) return;
    setPicked(q);
    setAnswered((n) => n + 1);
    setUsed((s) => new Set([...s, current.id]));
    if (q.id === current.id) setScore((n) => n + 1);
    else setWrong((w) => (w.find((x) => x.id === current.id) ? w : [...w, current]));
  };

  const practiceWrong = () => {
    if (wrong.length === 0) return;
    const list = wrong;
    setPractice(list);
    setScore(0);
    setAnswered(0);
    setUsed(new Set());
    setWrong([]);
    setPicked(null);
    setCurrent(list[Math.floor(Math.random() * list.length)]);
  };

  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="-ml-2 w-fit">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Tillbaka
            </Button>
            <CardTitle className="text-center text-2xl">Karttest – {continentLabels[continent]}</CardTitle>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {questions.length} platser att lära sig
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Välj kategori:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="Alla">Alla kategorier</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <Button onClick={start} className="w-full" size="lg">
              Starta karttest
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const finished = !current && answered > 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="border-b bg-card px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Tillbaka
            </Button>
            <h1 className="text-xl font-bold">{practice ? 'Övningsläge' : 'Karttest'}</h1>
            <Badge variant={practice ? 'destructive' : 'secondary'}>
              {practice ? `Övar ${practice.length} platser` : selectedCategory}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm">
              Poäng: <span className="font-bold text-primary">{score}/{answered}</span>
            </div>
            <Button variant="outline" size="sm" onClick={start}>
              Börja om
            </Button>
          </div>
        </div>

        {current && (
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-lg font-medium">
                Var ligger <strong>{current.name}</strong>?
              </p>
              <Badge variant="outline">{current.category}</Badge>
            </div>
            <Progress value={(answered / Math.max(1, total)) * 100} className="h-2" />
          </div>
        )}
      </div>

      <div className="relative min-h-[400px] flex-1">
        <MapCanvas
          questions={visiblePins}
          correctId={current?.id ?? null}
          pickedId={picked?.id ?? null}
          reveal={!!picked}
          view={continent}
          onPick={pick}
        />

        {picked && current && (
          <div
            className={`absolute left-1/2 top-4 z-10 max-w-sm -translate-x-1/2 rounded-lg p-4 text-center shadow-lg ${
              picked.id === current.id ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-900'
            }`}
          >
            <p className="text-sm font-medium">
              {picked.id === current.id
                ? `Rätt! ${current.name} ligger här.`
                : `Du valde ${picked.name}. Rätt svar är ${current.name} – grön prick.`}
            </p>
            <Button size="sm" variant="secondary" className="mt-2" onClick={nextQuestion}>
              Nästa fråga
            </Button>
          </div>
        )}

        {finished && (
          <div className="absolute inset-0 z-20 flex items-center justify-center overflow-auto bg-background/85 p-4">
            <Card className="w-full max-w-lg">
              <CardContent className="p-6">
                <h2 className="mb-2 text-center text-2xl font-bold">
                  {practice ? 'Övning klar!' : 'Spelet klart!'}
                </h2>
                <p className="mb-2 text-center text-lg">
                  Du fick <span className="font-bold text-primary">{score}</span> av {answered} rätt
                </p>
                <p className="mb-4 text-center text-muted-foreground">
                  {Math.round((score / Math.max(1, answered)) * 100)}% rätt
                </p>

                {wrong.length > 0 ? (
                  <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-destructive">
                      <RotateCcw className="h-4 w-4" />
                      Platser att öva på ({wrong.length} stycken)
                    </h3>
                    <ScrollArea className="max-h-32">
                      <ul className="text-sm">
                        {wrong.map((q) => (
                          <li
                            key={q.id}
                            className="flex items-center justify-between border-b border-border/50 py-1 last:border-0"
                          >
                            <span className="font-medium">{q.name}</span>
                            <Badge variant="outline" className="text-xs">{q.category}</Badge>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                    <Button onClick={practiceWrong} className="mt-3 w-full" variant="destructive">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Öva dessa igen
                    </Button>
                  </div>
                ) : !practice ? (
                  <div className="mb-4 rounded-lg border border-emerald-600/20 bg-emerald-600/10 p-4 text-center">
                    <p className="font-medium text-emerald-700">🎉 Perfekt! Inga fel den här rundan!</p>
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <Button onClick={start} className="flex-1" variant="outline">
                    Börja om från början
                  </Button>
                  <Button onClick={() => navigate('/')} variant="secondary">
                    Tillbaka
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="bg-muted px-4 py-2 text-center text-sm text-muted-foreground">
        Klicka på den blå pricken där du tror platsen ligger
      </div>
    </div>
  );
};

export default Karttest;