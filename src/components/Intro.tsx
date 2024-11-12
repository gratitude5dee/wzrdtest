import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';

export function Intro() {
  const navigate = useNavigate();

  return (
    <div 
      className="relative w-full h-screen overflow-hidden cursor-pointer" 
      onClick={() => navigate('/login')}
    >
      <Spline scene="https://prod.spline.design/vovjzFrBFk08eimK/scene.splinecode" />
    </div>
  );
}