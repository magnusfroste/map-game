import { americaQuestions } from './geographyQuestions';
import { europeQuestions } from './europeQuestions';
import { africaQuestions } from './africaQuestions';
import { asiaQuestions } from './asiaQuestions';
import type { GeographyQuestion } from './geographyQuestions';

export type Continent = 'amerika' | 'europa' | 'afrika' | 'asien' | 'alla';

export const continentLabels: Record<Continent, string> = {
  amerika: 'Amerika',
  europa: 'Europa',
  afrika: 'Afrika',
  asien: 'Asien',
  alla: 'Alla världsdelar',
};

export const getQuestionsByContinent = (continent: Continent): GeographyQuestion[] => {
  switch (continent) {
    case 'amerika':
      return americaQuestions;
    case 'europa':
      return europeQuestions;
    case 'afrika':
      return africaQuestions;
    case 'asien':
      return asiaQuestions;
    case 'alla':
      return [...americaQuestions, ...europeQuestions, ...africaQuestions, ...asiaQuestions];
    default:
      return americaQuestions;
  }
};

export const allQuestions: GeographyQuestion[] = [
  ...americaQuestions,
  ...europeQuestions,
  ...africaQuestions,
  ...asiaQuestions,
];
