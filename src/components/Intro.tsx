import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Intro() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="relative w-full h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <Spline scene="https://prod.spline.design/vovjzFrBFk08eimK/scene.splinecode" />
      <motion.button 
        onClick={() => navigate('/login')}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-20 bg-transparent cursor-pointer hover:bg-white/5 rounded-full transition-colors"
        style={{ marginTop: '240px' }}
        aria-label="Connect Now"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
    </motion.div>
  );
}