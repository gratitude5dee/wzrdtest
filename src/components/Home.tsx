import { Settings } from "lucide-react";
import { Button } from "./ui/button";

const personalities = [
  {
    id: "quick-answers",
    title: "Quick Answers",
    description: "Fast question-answering",
    gradient: "from-blue-100 to-blue-200",
    icon: "🤖"
  },
  {
    id: "life-advice",
    title: "Life Advice",
    description: "Advice given with a balance of empathy and assertiveness",
    gradient: "from-green-100 to-green-200",
    icon: "🌟"
  },
  {
    id: "storytelling",
    title: "Storytelling",
    description: "Fantastical storytelling",
    gradient: "from-pink-100 to-pink-200",
    icon: "📚"
  },
  {
    id: "deeper-questions",
    title: "Deeper Questions",
    description: "Answers questions but from more of a philosophical and scientific angle",
    gradient: "from-purple-100 to-purple-200",
    icon: "🤔"
  },
  {
    id: "spirituality",
    title: "Spirituality",
    description: "Gives spiritual advice",
    gradient: "from-orange-100 to-orange-200",
    icon: "🕊️"
  },
  {
    id: "emotional-reflection",
    title: "Emotional Reflection",
    description: "Gives advice on emotion from the perspective of an emotion scientist",
    gradient: "from-cyan-100 to-cyan-200",
    icon: "❤️"
  }
];

export function Home() {
  return (
    <div className="min-h-screen gradient-bg p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <span className="text-white text-xs">H</span>
          </div>
          <span className="text-xl font-semibold">hume</span>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalities.map((personality) => (
          <div
            key={personality.id}
            className={`card-gradient rounded-3xl p-6 space-y-2 cursor-pointer hover:scale-105 transition-transform`}
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl">
              {personality.icon}
            </div>
            <h3 className="text-xl font-semibold">{personality.title}</h3>
            <p className="text-gray-600 text-sm">{personality.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}