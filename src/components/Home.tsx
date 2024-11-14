import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ActiveCallContext } from "../App";
import { Settings } from "./Settings";
import { cn } from "@/lib/utils";
import { CallBar } from "./CallBar";
import { PersonalityGrid } from "./PersonalityGrid";
import { personalities } from "@/data/personalities";
import { GradientShader } from "./GradientShader";
import { motion } from "framer-motion";

export function Home() {
  const navigate = useNavigate();
  const { activeCall, setActiveCall } = useContext(ActiveCallContext);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getPersonalityById = (title: string) => {
    return personalities.find(p => p.id === title) || {
      id: title,
      title: title,
      icon: "/wzrd-logo.png"
    };
  };

  const activePersonality = activeCall ? {
    icon: getPersonalityById(activeCall).icon,
    title: activeCall
  } : null;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeCall) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeCall]);

  const handleEndCall = () => {
    setActiveCall(null);
    setCallDuration(0);
  };

  return (
    <motion.div 
      className="min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gradient Shader Background */}
      <div className="absolute inset-0">
        <GradientShader />
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 backdrop-blur-[100px] bg-white/10" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-6 pb-32 overflow-auto [--scrollbar-thumb:rgba(0,0,0,0.2)] hover:[--scrollbar-thumb:rgba(0,0,0,0.3)] [--scrollbar-track:transparent] [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[var(--scrollbar-track)] [&::-webkit-scrollbar-thumb]:bg-[var(--scrollbar-thumb)] [&::-webkit-scrollbar-thumb]:rounded-full transition-colors duration-300">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8">
              <img src="/wzrd-logo.png" alt="WZRD" className="w-full h-full" />
            </div>
            <span className="text-2xl font-semibold text-white text-glow-strong">WZRD.tech</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-lg border border-white/20"
            onClick={() => setSettingsOpen(true)}
          >
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </header>

        <PersonalityGrid 
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          navigate={navigate}
        />

        <CallBar 
          activeCall={activeCall}
          isMicMuted={isMicMuted}
          callDuration={callDuration}
          onMicToggle={() => setIsMicMuted(!isMicMuted)}
          onEndCall={handleEndCall}
          activePersonality={activePersonality}
        />

        <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </motion.div>
  );
}