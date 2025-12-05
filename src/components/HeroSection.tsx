import { Globe, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Logo/Icon */}
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Globe className="h-10 w-10 text-primary-foreground" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-accent animate-pulse" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Lär dig geografi på ett{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              roligt sätt
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Kartkul är ett interaktivt sätt att träna dina geografikunskaper. 
            Klicka på rätt plats på kartan och se hur bra du kan världens geografi!
          </p>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground border border-accent/30">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-driven dokumentanalys</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
