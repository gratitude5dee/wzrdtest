import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export function Intro() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full screen Spline scene */}
      <Spline scene="https://prod.spline.design/vovjzFrBFk08eimK/scene.splinecode" />
      
      {/* Centered Button */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Button 
          onClick={() => navigate('/login')}
          className="bg-white text-black hover:bg-white/90 text-lg px-8 py-2 rounded-full shadow-lg"
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  );
}