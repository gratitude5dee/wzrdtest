import { Settings as SettingsIcon, History } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ActiveCallContext } from "../App";
import { Settings } from "./Settings";
import { cn } from "@/lib/utils";
import { CallBar } from "./CallBar";
import { PersonalityGrid } from "./PersonalityGrid";
import { GradientShader } from "./GradientShader";
import { motion } from "framer-motion";

export function Home() {
  const navigate = useNavigate();
  const { activeCall, setActiveCall } = useContext(ActiveCallContext);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <motion.div 
      className="min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        <GradientShader />
      </div>

      <div className="absolute inset-0 backdrop-blur-[100px] bg-white/10" />

      <div className="relative z-10 min-h-screen p-6 pb-32">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8">
              <img src="/wzrd-logo.png" alt="WZRD" className="w-full h-full" />
            </div>
            <span className="text-2xl font-semibold text-white text-glow-strong">WZRD.tech</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/chat-history')} 
              className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-lg border border-white/20"
            >
              <History className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-lg border border-white/20"
              onClick={() => setSettingsOpen(true)}
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <PersonalityGrid />

        <CallBar />

        <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </motion.div>
  );
}