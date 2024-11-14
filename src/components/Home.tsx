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
    <div className="min-h-screen bg-[#FFF8F6] p-6 pb-32 overflow-auto [--scrollbar-thumb:rgba(0,0,0,0.2)] hover:[--scrollbar-thumb:rgba(0,0,0,0.3)] [--scrollbar-track:transparent] [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[var(--scrollbar-track)] [&::-webkit-scrollbar-thumb]:bg-[var(--scrollbar-thumb)] [&::-webkit-scrollbar-thumb]:rounded-full transition-colors duration-300">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8">
            <img src="/wzrd-logo.png" alt="WZRD" className="w-full h-full" />
          </div>
          <span className="text-2xl font-semibold gradient-text">WZRD.tech</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-[#2A2A2A] text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
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
  );
}