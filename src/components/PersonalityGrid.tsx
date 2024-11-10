import { personalities } from "@/data/personalities";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface PersonalityGridProps {
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
  navigate: (path: string) => void;
}

export function PersonalityGrid({ hoveredCard, setHoveredCard, navigate }: PersonalityGridProps) {
  const cardsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cardsRef.current.forEach((card, id) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 400;

        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          const rotateX = (y / rect.height) * 20 * strength;
          const rotateY = (x / rect.width) * 20 * strength;

          card.style.setProperty('--x', `${x * 0.1 * strength}px`);
          card.style.setProperty('--y', `${y * 0.1 * strength}px`);
          card.style.setProperty('--rx', `${-rotateX}`);
          card.style.setProperty('--ry', `${rotateY}`);
          card.style.setProperty('--angle', `${Math.max(Math.abs(rotateX), Math.abs(rotateY))}deg`);
          
          card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(${1 + strength * 0.05})
          `;
        } else {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="grid grid-cols-2 auto-rows-[180px] gap-4">
      {personalities.map((personality) => (
        <button
          key={personality.id}
          ref={(el) => {
            if (el) cardsRef.current.set(personality.id, el);
            else cardsRef.current.delete(personality.id);
          }}
          className={cn(
            personality.gradient,
            personality.span || '',
            'rounded-[32px] p-6 text-left transition-all duration-300 relative overflow-hidden gradient-card magnetic-element',
            'group hover:shadow-2xl',
            hoveredCard === personality.id ? 'z-10' : 'z-0'
          )}
          onClick={() => personality.id === "affirmations" ? 
            navigate("/affirmations") : 
            navigate(`/chat/${personality.id}`)
          }
          onMouseEnter={() => setHoveredCard(personality.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="relative z-10 h-full flex flex-col">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center overflow-hidden mb-3 animate-soft-bounce">
              <img src={personality.icon} alt={personality.title} className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-[#2A2A2A] dark:text-white group-hover:gradient-text transition-all duration-300">
                {personality.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {personality.description}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      ))}
    </div>
  );
}