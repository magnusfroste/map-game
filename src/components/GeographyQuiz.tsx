import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { geographyQuestions, categories, GeographyQuestion } from '@/data/geographyQuestions';
import { Progress } from '@/components/ui/progress';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibGl0ZWl0IiwiYSI6ImNqenU3MjdocjBjMmszb3Fpa3hyZjNzb28ifQ.-N7x3KsTUFpWU7oVNZVWxw';

const GeographyQuiz = () => {
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
      setFeedback(`Spelet klart! Slutresultat: ${score}/${questionsAnswered}`);
      setFeedbackType('success');
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

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (!currentQuestion || showAnswer) return;

    const { lng, lat } = e.lngLat;
    
    // Lägg till användarens markör
    const newUserMarker = new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat([lng, lat])
      .addTo(map.current!);
    setUserMarker(newUserMarker);
    
    // Beräkna avstånd
    const distance = calculateDistance(lat, lng, currentQuestion.lat, currentQuestion.lng);
    const toleranceInKm = currentQuestion.tolerance * 111; // Ungefär km per grad
    
    // Visa rätt svar
    const newCorrectMarker = new mapboxgl.Marker({ color: '#16a34a' })
      .setLngLat([currentQuestion.lng, currentQuestion.lat])
      .addTo(map.current!);
    setCorrectMarker(newCorrectMarker);
    
    setShowAnswer(true);
    setQuestionsAnswered(prev => prev + 1);
    setUsedQuestions(prev => new Set([...prev, currentQuestion.id]));
    
    if (distance <= toleranceInKm) {
      setScore(prev => prev + 1);
      setFeedback(`Rätt! ${currentQuestion.name} ligger här. Avstånd: ${Math.round(distance)} km`);
      setFeedbackType('success');
    } else {
      setFeedback(`Fel. ${currentQuestion.name} ligger här (grön markör). Ditt svar var ${Math.round(distance)} km bort.`);
      setFeedbackType('warning');
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

      map.current.on('click', handleMapClick);
      
      map.current.on('load', () => {
        console.log('Mapbox map loaded successfully');
        try {
          map.current?.resize();
          const canvas = map.current?.getCanvas();
          if (canvas) canvas.style.cursor = 'crosshair';
        } catch {}
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

  const startGame = () => {
    setGameStarted(true);
    // Ge React tid att rendera map container innan vi initierar kartan
    setTimeout(() => {
      initializeMap();
      setTimeout(() => startNewQuestion(), 500);
    }, 100);
  };

  const resetGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setUsedQuestions(new Set());
    setFeedback('');
    setFeedbackType('');
    setShowAnswer(false);
    if (userMarker) userMarker.remove();
    if (correctMarker) correctMarker.remove();
    startNewQuestion();
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Karttest - Nord- och Sydamerika</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Välj kategori:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
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
            <Progress value={(questionsAnswered / geographyQuestions.length) * 100} className="h-2" />
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
        Klicka på kartan för att markera var du tror platsen ligger
      </div>
    </div>
  );
};

export default GeographyQuiz;