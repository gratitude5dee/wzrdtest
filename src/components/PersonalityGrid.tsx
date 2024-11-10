import { personalities } from "@/data/personalities";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface PersonalityGridProps {
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
  navigate: (path: string) => void;
}

export function PersonalityGrid({ hoveredCard, setHoveredCard, navigate }: PersonalityGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const cards = gridRef.current.getElementsByClassName('personality-card');
      
      Array.from(cards).forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const maxRotate = 10;
        const rotateX = ((y - centerY) / centerY) * -maxRotate;
        const rotateY = ((x - centerX) / centerX) * maxRotate;
        
        (card as HTMLElement).style.transform = 
          `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
    };

    const handleMouseLeave = () => {
      if (!gridRef.current) return;
      const cards = gridRef.current.getElementsByClassName('personality-card');
      
      Array.from(cards).forEach((card) => {
        (card as HTMLElement).style.transform = 
          'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    };

    const grid = gridRef.current;
    if (grid) {
      grid.addEventListener('mousemove', handleMouseMove);
      grid.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (grid) {
        grid.removeEventListener('mousemove', handleMouseMove);
        grid.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={gridRef} className="grid grid-cols-2 auto-rows-[180px] gap-4">
      {personalities.map((personality) => (
        <button
          key={personality.id}
          className={cn(
            'personality-card',
            personality.gradient,
            personality.span || '',
            'rounded-[32px] p-6 text-left transition-all duration-300',
            'relative overflow-hidden group',
            hoveredCard === personality.id ? 'z-10' : 'z-0',
            'border border-white/5 hover:border-white/20',
            'bg-gradient-to-br hover:shadow-xl',
          )}
          onClick={() => personality.id === "affirmations" ? 
            navigate("/affirmations") : 
            navigate(`/chat/${personality.id}`)
          }
          onMouseEnter={() => setHoveredCard(personality.id)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <img src={personality.icon} alt={personality.title} className="w-10 h-10 animate-pulse-soft" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                {personality.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/70 transition-colors">
                {personality.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}