import { personalities } from "@/data/personalities";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface PersonalityGridProps {
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
  navigate: (path: string) => void;
}

export function PersonalityGrid({ hoveredCard, setHoveredCard, navigate }: PersonalityGridProps) {
  const cardRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!hoveredCard || !cardRefs.current[hoveredCard]) return;

      const card = cardRefs.current[hoveredCard];
      const rect = card?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const angleX = (mouseY - centerY) / 15;
      const angleY = (centerX - mouseX) / 15;
      const glowX = ((mouseX - rect.left) / rect.width) * 100;
      const glowY = ((mouseY - rect.top) / rect.height) * 100;

      if (card) {
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.05, 1.05, 1.05)`;
        card.style.setProperty('--glow-x', `${glowX}%`);
        card.style.setProperty('--glow-y', `${glowY}%`);
      }
    };

    const handleMouseLeave = () => {
      if (!hoveredCard || !cardRefs.current[hoveredCard]) return;
      const card = cardRefs.current[hoveredCard];
      if (card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hoveredCard]);

  return (
    <div className="grid grid-cols-2 auto-rows-[180px] gap-4">
      {personalities.map((personality) => (
        <button
          key={personality.id}
          ref={el => cardRefs.current[personality.id] = el}
          className={cn(
            personality.gradient,
            personality.span || '',
            'rounded-[32px] p-6 text-left relative overflow-hidden transition-all duration-300',
            'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300',
            'after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_var(--glow-x,50%)_var(--glow-y,50%),rgba(255,255,255,0.4)_0%,transparent_60%)] after:opacity-0 after:transition-opacity after:duration-300',
            'hover:before:opacity-100 hover:after:opacity-100',
            'group backdrop-blur-lg border border-white/10',
            hoveredCard === personality.id ? 
              'z-10 shadow-2xl shadow-white/20 animate-glow-pulse' : 
              'z-0 hover:shadow-xl hover:shadow-white/10'
          )}
          onClick={() => personality.id === "affirmations" ? 
            navigate("/affirmations") : 
            navigate(`/chat/${personality.id}`)
          }
          onMouseEnter={() => setHoveredCard(personality.id)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ 
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform, box-shadow'
          }}
        >
          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center overflow-hidden mb-3 group-hover:animate-card-hover">
              <img 
                src={personality.icon} 
                alt={personality.title} 
                className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-[#2A2A2A] group-hover:text-black transition-colors">
                {personality.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-800 transition-colors">
                {personality.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}