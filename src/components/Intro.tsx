import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Intro() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div 
      className="relative w-full h-screen overflow-hidden bg-[#FFF8F6]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <div className={`w-full h-full ${isMobile ? 'scale-[2.5]' : ''}`}>
        <Spline 
          scene="https://prod.spline.design/vovjzFrBFk08eimK/scene.splinecode"
          className="w-full h-full"
        />
      </div>
      <button 
        onClick={() => navigate('/login')}
        className={`
          absolute left-1/2 -translate-x-1/2 w-64 h-20 
          bg-transparent cursor-pointer hover:bg-white/5 
          rounded-full transition-colors
          ${isMobile ? 'bottom-24' : 'top-1/2 -translate-y-1/2 mt-60'}
        `}
        aria-label="Connect Now"
      />
    </motion.div>
  );
}