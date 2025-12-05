import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { geographyQuestions as defaultQuestions, categories as defaultCategories, GeographyQuestion } from '@/data/geographyQuestions';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibGl0ZWl0IiwiYSI6ImNqenU3MjdocjBjMmszb3Fpa3hyZjNzb28ifQ.-N7x3KsTUFpWU7oVNZVWxw';

interface GeographyQuizProps {
  customQuestions?: GeographyQuestion[] | null;
}

const GeographyQuiz = ({ customQuestions }: GeographyQuizProps) => {
  const navigate = useNavigate();
  
  // Use custom questions if provided, otherwise default
  const geographyQuestions = useMemo(() => 
    customQuestions && customQuestions.length > 0 ? customQuestions : defaultQuestions,
    [customQuestions]
  );
  
  const categories = useMemo(() => 
    [...new Set(geographyQuestions.map(q => q.category))],
    [geographyQuestions]
  );
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<GeographyQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'warning' | 'error' | ''>('');
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('Alla');
  const [gameStarted, setGameStarted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null);
  const [correctMarker, setCorrectMarker] = useState<mapboxgl.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [answerMarkers, setAnswerMarkers] = useState<mapboxgl.Marker[]>([]);

  const getRandomQuestion = () => {
    const availableQuestions = geographyQuestions.filter(q => 
      !usedQuestions.has(q.id) && 
      (selectedCategory === 'Alla' || q.category === selectedCategory)
    );
    
    if (availableQuestions.length === 0) {
      return null; // Alla frågor besvarade
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  };

  const startNewQuestion = () => {
    const newQuestion = getRandomQuestion();
    if (!newQuestion) {
      // Spelet klart
      setCurrentQuestion(null);
      setFeedback(`Spelet klart! Slutresultat: ${score}/${questionsAnswered}`);
      setFeedbackType('success');
      // Rensa markörer
      if (userMarker) userMarker.remove();
      if (correctMarker) correctMarker.remove();
      answerMarkers.forEach(marker => marker.remove());
      setUserMarker(null);
      setCorrectMarker(null);
      setAnswerMarkers([]);
      return;
    }

    setCurrentQuestion(newQuestion);
    setFeedback('');
    setFeedbackType('');
    setShowAnswer(false);

    // Ta bort föregående markörer
    if (userMarker) {
      userMarker.remove();
      setUserMarker(null);
    }
    if (correctMarker) {
      correctMarker.remove();
      setCorrectMarker(null);
    }
    // Pins läggs till i useEffect när currentQuestion uppdaterats
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Jordens radie i km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const addAnswerPins = () => {
    if (!map.current || !currentQuestion) return;

    // Ta bort gamla pins
    answerMarkers.forEach(marker => marker.remove());
    setAnswerMarkers([]);

    // Få relevanta frågor baserat på kategori
    const relevantQuestions = geographyQuestions.filter(q => 
      selectedCategory === 'Alla' || q.category === selectedCategory
    );

    // Lägg till pins för alla relevanta frågor
    const newMarkers: mapboxgl.Marker[] = [];
    relevantQuestions.forEach((question) => {
      const pinElement = document.createElement('div');
      pinElement.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-blue-600 transition-colors';
      pinElement.title = 'Klicka här!';
      
      const marker = new mapboxgl.Marker(pinElement)
        .setLngLat([question.lng, question.lat])
        .addTo(map.current!);

      // Lägg till klick-hanterare
      pinElement.addEventListener('click', () => handlePinClick(question));
      
      newMarkers.push(marker);
    });

    setAnswerMarkers(newMarkers);
  };

  const handlePinClick = (clickedQuestion: GeographyQuestion) => {
    if (!currentQuestion || showAnswer) return;

    console.log('Pin clicked:', clickedQuestion.name, 'Target:', currentQuestion.name);
    
    // Lägg till användarens markör (blå)
    const clickedPin = answerMarkers.find(marker => {
      const pos = marker.getLngLat();
      return Math.abs(pos.lng - clickedQuestion.lng) < 0.001 && Math.abs(pos.lat - clickedQuestion.lat) < 0.001;
    });
    
    if (clickedPin) {
      const pinElement = clickedPin.getElement();
      pinElement.className = 'w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg scale-125';
      setUserMarker(clickedPin);
    }
    
    // Visa rätt svar (grön)
    const correctPin = answerMarkers.find(marker => {
      const pos = marker.getLngLat();
      return Math.abs(pos.lng - currentQuestion.lng) < 0.001 && Math.abs(pos.lat - currentQuestion.lat) < 0.001;
    });
    
    if (correctPin) {
      const pinElement = correctPin.getElement();
      pinElement.className = 'w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg scale-125';
      setCorrectMarker(correctPin);
    }
    
    setShowAnswer(true);
    setQuestionsAnswered(prev => prev + 1);
    setUsedQuestions(prev => new Set([...prev, currentQuestion.id]));
    
    // Beräkna avstånd
    const distance = calculateDistance(clickedQuestion.lat, clickedQuestion.lng, currentQuestion.lat, currentQuestion.lng);
    
    if (clickedQuestion.id === currentQuestion.id) {
      setScore(prev => prev + 1);
      setFeedback(`Rätt! ${currentQuestion.name} ligger här.`);
      setFeedbackType('success');
      toast({
        title: 'Rätt svar!',
        description: `${currentQuestion.name} — Bra jobbat!`,
      });
    } else {
      setFeedback(`Fel. Du klickade på ${clickedQuestion.name}, men rätt svar är ${currentQuestion.name} (grön pin).`);
      setFeedbackType('warning');
      toast({
        title: 'Inte riktigt',
        description: `Du valde ${clickedQuestion.name}, men rätt svar var ${currentQuestion.name}.`,
        variant: 'destructive',
      });
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-60, 20], // Centrerat över Amerika
        zoom: 2,
      });

      // Navigationskontroller
      map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

      map.current.on('load', () => {
        console.log('Mapbox map loaded successfully');
        setMapReady(true);
        try {
          map.current?.resize();
          const canvas = map.current?.getCanvas();
          if (canvas) canvas.style.cursor = 'default';
        } catch {}
        // Starta första frågan när kartan är redo
        startNewQuestion();
      });
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setFeedback('Fel vid laddning av karta. Kontrollera internetanslutningen.');
        setFeedbackType('error');
      });
      
    } catch (error) {
      console.error('Failed to initialize Mapbox:', error);
      setFeedback('Kunde inte ladda kartan. Kontrollera Mapbox API-nyckeln.');
      setFeedbackType('error');
    }
  };

  // Startar spelet och initierar kartan via useEffect
  const startGame = () => {
    setGameStarted(true);
  };

  // Initiera kartan när spelet startat och containern finns
  useEffect(() => {
    if (gameStarted && !map.current && mapContainer.current) {
      initializeMap();
    }
  }, [gameStarted]);

  // Lägg till/uppdatera pins när fråga, kategori eller karta är redo
  useEffect(() => {
    if (!map.current || !mapReady) return;

    // Inget aktivt spel: rensa gamla pins
    if (!currentQuestion) {
      answerMarkers.forEach(m => m.remove());
      setAnswerMarkers([]);
      return;
    }

    addAnswerPins();
  }, [currentQuestion, selectedCategory, mapReady]);

  const resetGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setUsedQuestions(new Set());
    setFeedback('');
    setFeedbackType('');
    setShowAnswer(false);
    if (userMarker) userMarker.remove();
    if (correctMarker) correctMarker.remove();
    answerMarkers.forEach(marker => marker.remove());
    setAnswerMarkers([]);
    startNewQuestion();
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Tillbaka
              </Button>
            </div>
            <CardTitle className="text-center text-2xl">
              {customQuestions ? 'AI-genererat karttest' : 'Karttest - Nord- och Sydamerika'}
            </CardTitle>
            {customQuestions && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {geographyQuestions.length} frågor från ditt dokument
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Välj kategori:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="Alla">Alla kategorier</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {feedback && feedbackType === 'error' && (
              <div className="p-3 rounded-md text-sm bg-destructive text-destructive-foreground mb-4">
                {feedback}
              </div>
            )}
            
            <Button onClick={startGame} className="w-full" size="lg">
              Starta karttest
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Karttest</h1>
            <Badge variant="secondary">{selectedCategory}</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm">
              Poäng: <span className="font-bold text-primary">{score}/{questionsAnswered}</span>
            </div>
            <Button variant="outline" size="sm" onClick={resetGame}>
              Börja om
            </Button>
          </div>
        </div>
        
        {currentQuestion && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-medium">Var ligger <strong>{currentQuestion.name}</strong>?</p>
              <Badge variant="outline">{currentQuestion.category}</Badge>
            </div>
            <Progress value={(questionsAnswered / (selectedCategory === 'Alla' ? geographyQuestions.length : geographyQuestions.filter(q => q.category === selectedCategory).length)) * 100} className="h-2" />
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-[400px]">
        <div 
          ref={mapContainer} 
          className="absolute inset-0 w-full h-full z-0 pointer-events-auto" 
          style={{ minHeight: '400px' }}
        />
        
        {feedback && (
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-10 max-w-sm text-center ${
            feedbackType === 'success' ? 'bg-success text-success-foreground' :
            feedbackType === 'warning' ? 'bg-warning text-warning-foreground' :
            'bg-card text-card-foreground border'
          }`}>
            <p className="text-sm font-medium">{feedback}</p>
            {showAnswer && (
              <Button 
                size="sm" 
                variant="secondary" 
                className="mt-2"
                onClick={startNewQuestion}
              >
                Nästa fråga
              </Button>
            )}
          </div>
        )}
        
        {!currentQuestion && questionsAnswered > 0 && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Card>
              <CardContent className="text-center p-6">
                <h2 className="text-2xl font-bold mb-2">Spelet klart!</h2>
                <p className="text-lg mb-4">
                  Du fick <span className="font-bold text-primary">{score}</span> av {questionsAnswered} rätt
                </p>
                <p className="text-muted-foreground mb-4">
                  {Math.round((score / questionsAnswered) * 100)}% rätt
                </p>
                <Button onClick={resetGame}>Spela igen</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <div className="bg-muted px-4 py-2 text-center text-sm text-muted-foreground">
        Klicka på de blå punkterna för att välja var du tror platsen ligger
      </div>
    </div>
  );
};

export default GeographyQuiz;