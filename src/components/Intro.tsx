import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ShaderCanvas } from '@/utils/shaders';

export function Intro() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shaderRef = useRef<ShaderCanvas | null>(null);

  useEffect(() => {
    if (canvasRef.current && !shaderRef.current) {
      shaderRef.current = new ShaderCanvas(canvasRef.current);
      shaderRef.current.start();
    }

    return () => {
      if (shaderRef.current) {
        shaderRef.current.stop();
      }
    };
  }, []);

  return (
    <motion.div 
      className="relative w-full h-screen overflow-hidden bg-[#FFF8F6]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'brightness(1.1) contrast(1.1)' }}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            WZRD.tech
          </h1>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:opacity-90 transition-opacity"
          >
            Connect Now
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}