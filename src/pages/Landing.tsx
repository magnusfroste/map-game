import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Target, BarChart3, Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import DocumentUpload from '@/components/DocumentUpload';
import type { GeographyQuestion } from '@/data/geographyQuestions';

const Landing = () => {
  const navigate = useNavigate();
  const [generatedQuestions, setGeneratedQuestions] = useState<GeographyQuestion[] | null>(null);

  const handleQuestionsGenerated = (questions: GeographyQuestion[]) => {
    setGeneratedQuestions(questions);
  };

  const startQuiz = (useGenerated: boolean) => {
    if (useGenerated && generatedQuestions) {
      // Store questions in sessionStorage for the quiz page
      sessionStorage.setItem('customQuestions', JSON.stringify(generatedQuestions));
      navigate('/quiz?custom=true');
    } else {
      sessionStorage.removeItem('customQuestions');
      navigate('/quiz');
    }
  };

  const features = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Interaktiva kartor',
      description: 'Utforska världen med detaljerade kartor från Mapbox',
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Klicka rätt',
      description: 'Klicka på rätt plats och se hur nära du kommer',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Följ din progress',
      description: 'Se hur bra du blir över tid med detaljerad statistik',
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'AI-genererade frågor',
      description: 'Ladda upp ditt eget material och få anpassade frågor',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Så fungerar det
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Redo att börja?
            </h2>
            <p className="text-muted-foreground mb-8">
              Starta direkt med våra färdiga frågor om Amerika eller ladda upp ditt eget material.
            </p>
            <Button 
              size="lg" 
              onClick={() => startQuiz(false)}
              className="group"
            >
              Starta testet
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Skapa egna frågor med AI
            </h2>
            <p className="text-muted-foreground">
              Ladda upp en textfil med geografiskt innehåll så skapar vår AI 
              anpassade frågor baserat på ditt material.
            </p>
          </div>

          <DocumentUpload onQuestionsGenerated={handleQuestionsGenerated} />

          {generatedQuestions && generatedQuestions.length > 0 && (
            <div className="mt-8 text-center">
              <div className="inline-flex flex-col items-center gap-4 p-6 rounded-2xl bg-success/10 border border-success/30">
                <div className="flex items-center gap-2 text-success">
                  <Target className="h-5 w-5" />
                  <span className="font-semibold">
                    {generatedQuestions.length} frågor genererade!
                  </span>
                </div>
                <div className="text-sm text-muted-foreground max-w-md">
                  Kategorier: {[...new Set(generatedQuestions.map(q => q.category))].join(', ')}
                </div>
                <Button 
                  size="lg" 
                  onClick={() => startQuiz(true)}
                  className="bg-success hover:bg-success/90"
                >
                  Starta med AI-frågor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Kartkul – Lär dig geografi på ett interaktivt sätt</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
