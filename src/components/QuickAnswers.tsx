import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import Spline from '@splinetool/react-spline';
import { motion } from "framer-motion";
import { GradientShader } from "./GradientShader";

export function QuickAnswers() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Gradient Shader Background */}
      <div className="absolute inset-0">
        <GradientShader />
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 backdrop-blur-[100px] bg-white/10" />
      
      {/* Back Button */}
      <div className="fixed top-8 left-8 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/home')}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Spline Scene */}
      <div className="absolute inset-0 z-10">
        <Spline
          scene="https://prod.spline.design/A92NacuoLxJo1Ias/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </motion.div>
  );
}