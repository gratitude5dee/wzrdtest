import Spline from '@splinetool/react-spline';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function QuickAnswersSpline() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="relative w-full h-screen overflow-hidden bg-[#FFF8F6]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <button
        onClick={() => navigate('/home')}
        className="absolute top-6 left-6 z-10 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>
      
      <Spline scene="https://prod.spline.design/eCLw6ZoUwM9rUFBg/scene.splinecode" />
    </motion.div>
  );
}