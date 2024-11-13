import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';

export function Intro() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Spline scene="https://prod.spline.design/vovjzFrBFk08eimK/scene.splinecode" />
      <button 
        onClick={() => navigate('/login')}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-20 bg-transparent cursor-pointer hover:bg-white/5 rounded-full transition-colors"
        style={{ marginTop: '240px' }}
        aria-label="Connect Now"
      />
    </div>
  );
}