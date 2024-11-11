import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ActiveCallContext } from "../App";
import { Settings } from "./Settings";
import { cn } from "@/lib/utils";
import { CallBar } from "./CallBar";

export function Home() {
  const navigate = useNavigate();
  const { activeCall, setActiveCall } = useContext(ActiveCallContext);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update CSS variables for gradient following mouse
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    
    // Calculate 3D rotation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -(y - centerY) / 20;
    const rotateY = (x - centerX) / 20;
    
    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(1.02, 1.02, 1.02)
    `;
    
    setHoveredCard(cardId);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    setHoveredCard(null);
  };

  const personalities = [
    {
      id: "quick-answers",
      title: "Quick Answers",
      description: "Get instant responses to your questions",
      icon: "/icons/quick.svg",
      gradient: "glass-gradient animate-glass-gradient",
    },
    {
      id: "emotional-reflection",
      title: "Emotional Reflection",
      description: "Process and understand your feelings",
      icon: "/icons/emotional.svg",
      gradient: "glass-gradient animate-glass-gradient",
    },
    {
      id: "life-advice",
      title: "Life Advice",
      description: "Guidance for life's challenges",
      icon: "/icons/advice.svg",
      gradient: "glass-gradient animate-glass-gradient",
    },
    {
      id: "storytelling",
      title: "Storytelling",
      description: "Engage with captivating narratives",
      icon: "/icons/story.svg",
      gradient: "glass-gradient animate-glass-gradient",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6 pb-32">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 animate-float">
            <img src="/logo.svg" alt="Logo" className="w-full h-full" />
          </div>
          <span className="text-2xl font-semibold text-white">Assistant</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full glass-card hover:bg-glass-hover"
          onClick={() => setSettingsOpen(true)}
        >
          <SettingsIcon className="h-5 w-5 text-white" />
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {personalities.map((personality) => (
          <div
            key={personality.id}
            className={cn(
              "glass-card group cursor-pointer",
              personality.gradient,
              hoveredCard === personality.id ? 'z-10' : 'z-0'
            )}
            onClick={() => navigate(`/chat/${personality.id}`)}
            onMouseMove={(e) => handleMouseMove(e, personality.id)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="glass-shine animate-glass-shine" />
            <div className="relative p-8 z-10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <img src={personality.icon} alt={personality.title} className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{personality.title}</h3>
              <p className="text-white/70">{personality.description}</p>
            </div>
          </div>
        ))}
      </div>

      <CallBar 
        activeCall={activeCall}
        onEndCall={() => setActiveCall(null)}
      />

      <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}