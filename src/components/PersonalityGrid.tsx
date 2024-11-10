import { personalities } from "@/data/personalities";
import { cn } from "@/lib/utils";

interface PersonalityGridProps {
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
  navigate: (path: string) => void;
}

export function PersonalityGrid({ hoveredCard, setHoveredCard, navigate }: PersonalityGridProps) {
  const handleCardMouseMove = (e: React.MouseEvent<HTMLButtonElement>, personalityId: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxDistance = 10;

    const offsetX = ((x - centerX) / centerX) * maxDistance;
    const offsetY = ((y - centerY) / centerY) * maxDistance;

    card.style.transform = `perspective(1000px) rotateX(${-offsetY}deg) rotateY(${offsetX}deg) scale(1.02)`;
    setHoveredCard(personalityId);
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    setHoveredCard(null);
  };

  return (
    <div className="grid grid-cols-2 auto-rows-[180px] gap-4">
      {personalities.map((personality) => (
        <button
          key={personality.id}
          className={cn(
            personality.gradient,
            personality.span || '',
            'rounded-[32px] p-6 text-left transition-all duration-300 relative overflow-hidden glow-card',
            hoveredCard === personality.id ? 'z-10' : 'z-0'
          )}
          onClick={() => personality.id === "affirmations" ? 
            navigate("/affirmations") : 
            navigate(`/chat/${personality.id}`)
          }
          onMouseMove={(e) => handleCardMouseMove(e, personality.id)}
          onMouseLeave={handleCardMouseLeave}
          style={{ transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden mb-3 animate-pulse-soft">
            <img src={personality.icon} alt={personality.title} className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-[#2A2A2A]">{personality.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{personality.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}