import { personalities } from "@/data/personalities";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";

interface PersonalityGridProps {
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
  navigate: (path: string) => void;
}

const SPRING = { tension: 0.1, friction: 0.9 };
const MAX_ROTATION = 15;
const MAX_LIFT = 1.08;
const MAGNETIC_PULL = 0.3;
const TRANSITION_BASE = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";

export function PersonalityGrid({ hoveredCard, setHoveredCard, navigate }: PersonalityGridProps) {
  const cardRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const velocities = useRef<{ [key: string]: { x: number; y: number } }>({});
  const rafId = useRef<number>();
  const isPointerDown = useRef(false);

  const calculateDynamics = useCallback((e: MouseEvent, card: HTMLElement, rect: DOMRect) => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = Math.max(rect.width, rect.height);

    // Calculate rotation and lift based on distance
    const rotationX = (deltaY / maxDistance) * MAX_ROTATION;
    const rotationY = -(deltaX / maxDistance) * MAX_ROTATION;
    const lift = 1 + ((maxDistance - distance) / maxDistance) * (MAX_LIFT - 1);

    // Add magnetic pull effect
    const pull = Math.min(distance / maxDistance, 1);
    const pullX = (deltaX * MAGNETIC_PULL * pull) / maxDistance;
    const pullY = (deltaY * MAGNETIC_PULL * pull) / maxDistance;

    return { rotationX, rotationY, lift, pullX, pullY, distance };
  }, []);

  const applyCardTransform = useCallback((
    card: HTMLElement, 
    dynamics: { rotationX: number; rotationY: number; lift: number; pullX: number; pullY: number }
  ) => {
    const { rotationX, rotationY, lift, pullX, pullY } = dynamics;
    
    // Apply spring physics
    const targetX = rotationX + pullX;
    const targetY = rotationY + pullY;
    const cardId = card.getAttribute('data-card-id') || '';
    
    if (!velocities.current[cardId]) {
      velocities.current[cardId] = { x: 0, y: 0 };
    }

    velocities.current[cardId].x += (targetX - velocities.current[cardId].x) * SPRING.tension;
    velocities.current[cardId].y += (targetY - velocities.current[cardId].y) * SPRING.friction;

    const transform = `
      perspective(1000px) 
      rotateX(${velocities.current[cardId].x}deg) 
      rotateY(${velocities.current[cardId].y}deg) 
      scale3d(${lift}, ${lift}, 1)
      translate3d(${pullX * 20}px, ${pullY * 20}px, 0)
    `;

    card.style.transform = transform;
    
    // Parallax effect for card content
    const content = card.querySelector('.card-content') as HTMLElement;
    if (content) {
      content.style.transform = `translate3d(${-pullX * 30}px, ${-pullY * 30}px, 0)`;
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!hoveredCard || !cardRefs.current[hoveredCard]) return;
    
    const card = cardRefs.current[hoveredCard];
    const rect = card?.getBoundingClientRect();
    if (!card || !rect) return;

    const dynamics = calculateDynamics(e, card, rect);
    
    if (dynamics.distance < rect.width * 1.5) {
      applyCardTransform(card, dynamics);
      card.style.transition = 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  }, [hoveredCard, calculateDynamics, applyCardTransform]);

  const resetCard = useCallback((cardId: string) => {
    const card = cardRefs.current[cardId];
    if (!card) return;

    velocities.current[cardId] = { x: 0, y: 0 };
    
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translate3d(0, 0, 0)';
    card.style.transition = TRANSITION_BASE;
    
    const content = card.querySelector('.card-content') as HTMLElement;
    if (content) {
      content.style.transform = 'translate3d(0, 0, 0)';
      content.style.transition = TRANSITION_BASE;
    }
  }, []);

  const debouncedMouseMove = debounce(handleMouseMove, 5);

  useEffect(() => {
    document.addEventListener('mousemove', debouncedMouseMove);
    document.addEventListener('mouseup', () => isPointerDown.current = false);
    document.addEventListener('mouseleave', () => {
      if (hoveredCard) {
        resetCard(hoveredCard);
        setHoveredCard(null);
      }
    });

    return () => {
      document.removeEventListener('mousemove', debouncedMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      debouncedMouseMove.cancel();
    };
  }, [hoveredCard, setHoveredCard, debouncedMouseMove, resetCard]);

  const handleCardClick = (personalityId: string) => {
    if (personalityId === "affirmations") {
      navigate("/affirmations");
    } else {
      navigate(`/chat/${personalityId}`);
    }
  };

  return (
    <div className="grid grid-cols-2 auto-rows-[180px] gap-4">
      {personalities.map((personality) => (
        <button
          key={personality.id}
          ref={el => cardRefs.current[personality.id] = el}
          data-card-id={personality.id}
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
          onClick={() => handleCardClick(personality.id)}
          onMouseEnter={() => setHoveredCard(personality.id)}
          onMouseLeave={() => {
            resetCard(personality.id);
            setHoveredCard(null);
          }}
          onMouseDown={() => isPointerDown.current = true}
          style={{ willChange: 'transform, box-shadow' }}
          aria-label={`Select ${personality.title} personality`}
        >
          <div className="card-content relative z-10 space-y-3 transition-transform duration-300">
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
