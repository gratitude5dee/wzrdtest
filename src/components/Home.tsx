import { Settings, Mic, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ActiveCallContext } from "../App";

const personalities = [
  {
    id: "quick-answers",
    title: "Quick Answers",
    description: "Fast question-answering",
    gradient: "bg-gradient-to-br from-blue-100 to-blue-200",
    icon: "/quick-answers-avatar.png"
  },
  {
    id: "life-advice",
    title: "Life Advice",
    description: "Advice given with a balance of empathy and assertiveness",
    gradient: "bg-gradient-to-br from-green-100 to-green-200",
    icon: "/life-advice-avatar.png"
  },
  {
    id: "storytelling",
    title: "Storytelling",
    description: "Fantastical storytelling",
    gradient: "bg-gradient-to-br from-pink-100 to-pink-200",
    icon: "/storytelling-avatar.png"
  },
  {
    id: "deeper-questions",
    title: "Deeper Questions",
    description: "Answers questions but from more of a philosophical and scientific angle",
    gradient: "bg-gradient-to-br from-rose-100 to-orange-100",
    icon: "/deeper-questions-avatar.png"
  },
  {
    id: "spirituality",
    title: "Spirituality",
    description: "Gives spiritual advice",
    gradient: "bg-gradient-to-br from-orange-100 to-pink-100",
    icon: "/spirituality-avatar.png"
  },
  {
    id: "emotional-reflection",
    title: "Emotional Reflection",
    description: "Gives advice on emotion from the perspective of an emotion scientist",
    gradient: "bg-gradient-to-br from-cyan-100 to-blue-100",
    icon: "/emotional-reflection-avatar.png"
  }
];

export function Home() {
  const navigate = useNavigate();
  const { activeCall } = useContext(ActiveCallContext);

  const getPersonalityById = (title: string) => {
    return personalities.find(p => p.title === title);
  };

  const activePersonality = activeCall ? getPersonalityById(activeCall) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8">
            <img src="/hume-logo.png" alt="Hume" className="w-full h-full" />
          </div>
          <span className="text-xl font-semibold">hume</span>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalities.map((personality) => (
          <button
            key={personality.id}
            className={`${personality.gradient} rounded-3xl p-6 space-y-2 text-left transition-transform hover:scale-105`}
            onClick={() => navigate(`/chat/${personality.id}`)}
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img src={personality.icon} alt={personality.title} className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold">{personality.title}</h3>
            <p className="text-gray-600 text-sm">{personality.description}</p>
          </button>
        ))}
      </div>

      {activeCall && activePersonality && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-4 py-2 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img src={activePersonality.icon} alt={activeCall} className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{activeCall}</span>
            <span className="text-xs text-gray-500">00:00:02</span>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-gray-100">
              <Mic className="h-5 w-5" />
            </button>
            <button 
              onClick={() => navigate(`/chat/${activePersonality.id}`)}
              className="p-2 rounded-full bg-red-500"
            >
              <Phone className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
