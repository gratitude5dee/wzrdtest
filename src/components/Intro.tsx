import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export function Intro() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-[#FFF8F6] overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0 w-full h-full">
        <Spline scene="https://prod.spline.design/vovjzFrBFk08eimK/scene.splinecode" />
      </div>
      
      {/* Overlay Content */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/10 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-white mb-6 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Welcome to wzrd
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-white/90 mb-8 text-center max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Your AI companion for personal growth and reflection
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Button 
            onClick={() => navigate('/login')}
            className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6"
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}