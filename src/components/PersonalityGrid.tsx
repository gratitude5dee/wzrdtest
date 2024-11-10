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
        
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const intensity = Math.max(0, 1 - distance / maxDistance);
        
        const maxRotate = 8;
        const rotateX = ((y - centerY) / centerY) * -maxRotate * intensity;
        const rotateY = ((x - centerX) / centerX) * maxRotate * intensity;
        
        (card as HTMLElement).style.transform = 
          `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${1 + intensity * 0.05}, ${1 + intensity * 0.05}, 1)`;
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
    <div 
      ref={gridRef} 
      className="grid grid-cols-1 md:grid-cols-2 auto-rows-[220px] gap-6 p-6"
    >
      {personalities.map((personality) => (
        <button
          key={personality.id}
          className={cn(
            'personality-card group relative w-full h-full',
            personality.span || '',
            'rounded-[32px] p-8 text-left transition-all duration-500',
            'overflow-hidden backdrop-blur-sm',
            hoveredCard === personality.id ? 'z-10' : 'z-0',
            'border border-white/10 hover:border-white/20',
            'bg-gradient-to-br from-white/10 to-white/5',
          )}
          onClick={() => personality.id === "affirmations" ? 
            navigate("/affirmations") : 
            navigate(`/chat/${personality.id}`)
          }
          onMouseEnter={() => setHoveredCard(personality.id)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ 
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
               style={{
                 background: `linear-gradient(135deg, 
                   ${personality.colors?.[0] || 'rgba(255,255,255,0.1)'}, 
                   ${personality.colors?.[1] || 'rgba(255,255,255,0.05)'}
                 )`
               }}
          />
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <img 
                src={personality.icon} 
                alt={personality.title} 
                className="w-8 h-8 animate-float" 
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-white group-hover:text-white/90 transition-colors">
                  {personality.title}
                </h3>
                <p className="text-white/60 text-base leading-relaxed group-hover:text-white/70 transition-colors">
                  {personality.description}
                </p>
              </div>
              
              <div className="flex items-center pt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <span className="text-white/80 text-sm font-medium">
                  Get Started
                </span>
                <svg 
                  className="w-5 h-5 ml-2 text-white/80 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}