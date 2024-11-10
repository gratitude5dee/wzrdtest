import { Settings as SettingsIcon, Mic, MicOff, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ActiveCallContext } from "../App";
import { Settings } from "./Settings";
import { cn } from "@/lib/utils";

const personalities = [
  {
    id: "quick-answers",
    title: "Quick Answers",
    description: "Fast question-answering",
    gradient: "bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200",
    span: "col-span-2",
    icon: "/quick-answers-avatar.png"
  },
  {
    id: "life-advice",
    title: "Life Advice",
    description: "Advice given with a balance of empathy and assertiveness",
    gradient: "bg-gradient-to-br from-green-100 via-green-50 to-green-200",
    icon: "/life-advice-avatar.png"
  },
  {
    id: "storytelling",
    title: "Storytelling",
    description: "Fantastical storytelling",
    gradient: "bg-gradient-to-br from-pink-100 via-pink-50 to-pink-200",
    icon: "/storytelling-avatar.png"
  },
  {
    id: "deeper-questions",
    title: "Deeper Questions",
    description: "Answers questions but from more of a philosophical and scientific angle",
    gradient: "bg-gradient-to-br from-rose-100 via-orange-50 to-orange-200",
    span: "col-span-2",
    icon: "/deeper-questions-avatar.png"
  },
  {
    id: "spirituality",
    title: "Spirituality",
    description: "Gives spiritual advice",
    gradient: "bg-gradient-to-br from-orange-100 via-pink-50 to-red-100",
    icon: "/spirituality-avatar.png"
  },
  {
    id: "emotional-reflection",
    title: "Emotional Reflection",
    description: "Gives advice on emotion from the perspective of an emotion scientist",
    gradient: "bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-200",
    icon: "/emotional-reflection-avatar.png"
  },
  {
    id: "affirmations",
    title: "Affirmations",
    description: "Daily affirmations with teleprompter",
    gradient: "bg-gradient-to-br from-purple-100 via-purple-50 to-pink-100",
    span: "col-span-2",
    icon: "/affirmations-avatar.png"
  }
];

export function Home() {
  const navigate = useNavigate();
  const { activeCall, setActiveCall } = useContext(ActiveCallContext);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallUIVisible, setIsCallUIVisible] = useState(true);

  const getPersonalityById = (title: string) => {
    return personalities.find(p => p.title === title);
  };

  const activePersonality = activeCall ? getPersonalityById(activeCall) : null;

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsCallUIVisible(false);
    setTimeout(() => {
      setActiveCall(null);
      setCallDuration(0);
    }, 300); // Match the duration of the slide-out animation
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] p-6 pb-32">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8">
            <img src="/hume-logo.png" alt="Hume" className="w-full h-full" />
          </div>
          <span className="text-2xl font-semibold">hume</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-[#2A2A2A] text-white hover:bg-gray-800"
          onClick={() => setSettingsOpen(true)}
        >
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </header>

      <div className="grid grid-cols-2 auto-rows-[180px] gap-4">
        {personalities.map((personality) => (
          <button
            key={personality.id}
            className={`${personality.gradient} ${personality.span || ''} rounded-[32px] p-6 text-left transition-transform hover:scale-[1.02] relative overflow-hidden`}
            onClick={() => personality.id === "affirmations" ? navigate("/affirmations") : navigate(`/chat/${personality.id}`)}
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden mb-3">
              <img src={personality.icon} alt={personality.title} className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-[#2A2A2A]">{personality.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{personality.description}</p>
            </div>
          </button>
        ))}
      </div>

      {activeCall && activePersonality && (
        <div 
          className={cn(
            "fixed bottom-8 left-4 right-4 bg-white rounded-full shadow-lg px-6 py-4 flex items-center justify-between transition-all duration-300 transform",
            isCallUIVisible ? "translate-y-0" : "translate-y-[200%]"
          )}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img src={activePersonality.icon} alt={activeCall} className="w-10 h-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">{activeCall}</span>
              <span className="text-sm text-gray-500">{formatTime(callDuration)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className={cn(
                "p-4 rounded-full transition-all duration-300",
                isMicMuted ? "bg-red-100 hover:bg-red-200" : "bg-gray-100 hover:bg-gray-200",
              )}
              onClick={() => setIsMicMuted(!isMicMuted)}
            >
              {isMicMuted ? (
                <MicOff className="h-5 w-5 text-red-600" />
              ) : (
                <Mic className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <button 
              onClick={handleEndCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            >
              <Phone className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      )}

      <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
