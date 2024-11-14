import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import Spline from '@splinetool/react-spline';
import { motion } from "framer-motion";

export function QuickAnswers() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="min-h-screen bg-[#FFF8F6] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="fixed top-8 left-8 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/home')}
          className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute inset-0 z-0">
        <Spline
          scene="https://prod.spline.design/A92NacuoLxJo1Ias/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </motion.div>
  );
}