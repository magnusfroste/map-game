import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Karttest from '@/components/Karttest';
import { Continent, getQuestionsByContinent } from '@/data/allQuestions';

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const continent = (searchParams.get('continent') as Continent) || 'amerika';
  const [questions, setQuestions] = useState(() => getQuestionsByContinent(continent));

  useEffect(() => {
    setQuestions(getQuestionsByContinent(continent));
  }, [continent]);

  return <Karttest questions={questions} continent={continent} />;
};

export default Quiz;
