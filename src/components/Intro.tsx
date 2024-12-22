import Spline from '@splinetool/react-spline';
import { useNavigate, useLocation, } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from "@crossmint/client-sdk-react-ui";
import { useEffect } from "react";

export function Intro() {
  const { login, jwt } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (jwt && location.pathname === '/') {
      navigate('/home');
    }
  }, [jwt, navigate, location.pathname]);

  return (
    <motion.div 
      className="relative w-full h-screen overflow-hidden bg-[#FFF8F6]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <Spline scene="https://prod.spline.design/vovjzFrBFk08eimK/scene.splinecode" />
      <button 
        onClick={() => login()}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-20 bg-transparent cursor-pointer hover:bg-white/5 rounded-full transition-colors"
        style={{ marginTop: '240px' }}
        aria-label="Connect Now"
      />
    </motion.div>
  );
}