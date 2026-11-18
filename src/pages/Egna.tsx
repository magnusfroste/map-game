import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OwnPlaces from '@/components/OwnPlaces';

const Egna = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto max-w-2xl px-5 pt-8">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="-ml-2">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Tillbaka
        </Button>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Egna platser</h1>
        <p className="mt-2 text-muted-foreground">
          Gör din egen karta att öva på: länder, städer, floder, berg – vad du vill.
          Listan finns kvar så länge fliken är öppen.
        </p>
      </header>
      <main className="mx-auto max-w-2xl px-5 py-6">
        <OwnPlaces />
      </main>
    </div>
  );
};

export default Egna;