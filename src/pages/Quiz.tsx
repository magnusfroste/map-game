import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Karttest from '@/components/Karttest';
import { Continent, getQuestionsByContinent } from '@/data/allQuestions';
import { loadOwnPlaces, clearOwnPlaces } from '@/lib/parsePlaces';

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const own = searchParams.get('own') === '1';
  const continent = (searchParams.get('continent') as Continent) || 'amerika';
  const [questions, setQuestions] = useState(() => getQuestionsByContinent(continent));

  useEffect(() => {
    if (!own) setQuestions(getQuestionsByContinent(continent));
  }, [continent, own]);

  const ownData = own ? loadOwnPlaces() : null;

  if (ownData) {
    return (
      <Karttest
        questions={ownData.places}
        continent="alla"
        ownLabel={ownData.label}
        isOwn
        onClearOwn={() => {
          clearOwnPlaces();
          navigate('/');
        }}
      />
    );
  }

  return <Karttest questions={questions} continent={continent} />;
};

export default Quiz;
