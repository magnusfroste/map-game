import { useNavigate } from 'react-router-dom';
import { MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Continent, continentLabels } from '@/data/allQuestions';
import OwnPlaces from '@/components/OwnPlaces';

const Landing = () => {
  const navigate = useNavigate();
  const continents: Continent[] = ['amerika', 'europa', 'afrika', 'asien', 'alla'];

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto max-w-3xl px-5 pt-12 pb-2 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <MapPin className="h-3.5 w-3.5" /> Geografi
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Karttest</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
          Träna på länder, huvudstäder, floder och berg – klicka på kartan där du tror
          platsen ligger. Fyra världsdelar, över hundra platser, ingen inloggning.
        </p>
        <Button size="lg" className="mt-6" onClick={() => navigate('/quiz')}>
          Starta karttest
        </Button>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Välj världsdel
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {continents.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => navigate('/quiz?continent=' + c)}
              className="rounded-xl border bg-card px-4 py-5 text-left font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <Globe className="mb-2 h-5 w-5 text-primary" />
              {continentLabels[c]}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <OwnPlaces />
        </div>
      </main>
    </div>
  );
};


export default Landing;
