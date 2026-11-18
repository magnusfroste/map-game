import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  navigate('/quiz');
  return null;
};

export default Index;
