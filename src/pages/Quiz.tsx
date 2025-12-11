import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GeographyQuiz from '@/components/GeographyQuiz';
import type { GeographyQuestion } from '@/data/geographyQuestions';
import { Continent, getQuestionsByContinent } from '@/data/allQuestions';

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const [customQuestions, setCustomQuestions] = useState<GeographyQuestion[] | null>(null);
  const isCustom = searchParams.get('custom') === 'true';
  const continent = (searchParams.get('continent') as Continent) || 'amerika';

  useEffect(() => {
    if (isCustom) {
      const stored = sessionStorage.getItem('customQuestions');
      if (stored) {
        try {
          const questions = JSON.parse(stored);
          setCustomQuestions(questions);
        } catch (e) {
          console.error('Failed to parse custom questions:', e);
        }
      }
    }
  }, [isCustom]);

  // Get questions based on continent or custom
  const questions = isCustom && customQuestions 
    ? customQuestions 
    : getQuestionsByContinent(continent);

  return <GeographyQuiz customQuestions={questions} continent={continent} isCustom={isCustom} />;
};

export default Quiz;
