import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GeographyQuiz from '@/components/GeographyQuiz';
import type { GeographyQuestion } from '@/data/geographyQuestions';

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const [customQuestions, setCustomQuestions] = useState<GeographyQuestion[] | null>(null);
  const isCustom = searchParams.get('custom') === 'true';

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

  return <GeographyQuiz customQuestions={customQuestions} />;
};

export default Quiz;
