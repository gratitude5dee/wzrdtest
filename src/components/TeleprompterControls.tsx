import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Play, Pause, Settings2, ArrowUp, ArrowDown, Space } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { cn } from '@/lib/utils';

interface TeleprompterControlsProps {
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onSpeedChange: (value: number) => void;
  onExit: () => void;
}

export const TeleprompterControls = ({
  isPlaying,
  speed,
  onTogglePlay,
  onSpeedChange,
  onExit
}: TeleprompterControlsProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const controlsRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const hideTimeout = useRef<NodeJS.Timeout>();

  useKeyboardShortcuts(onSpeedChange, onTogglePlay, speed);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
    setLastInteraction(Date.now());

    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    if (playButtonRef.current) {
      const button = playButtonRef.current;
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      const distanceX = e.clientX - buttonCenterX;
      const distanceY = e.clientY - buttonCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const maxDistance = 150;

      if (distance < maxDistance) {
        const magnetStrength = (maxDistance - distance) / maxDistance;
        const moveX = (distanceX * magnetStrength) * 0.3;
        const moveY = (distanceY * magnetStrength) * 0.3;
        button.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + magnetStrength * 0.1})`;
        button.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
      } else {
        button.style.transform = 'translate(0, 0) scale(1)';
        button.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }

    hideTimeout.current = setTimeout(() => {
      if (isPlaying && window.innerHeight - e.clientY > 200) {
        setIsVisible(false);
      }
    }, 2000);
  }, [isPlaying]);

  useEffect(() => {
    const teleprompterElement = document.querySelector('.teleprompter-text')?.parentElement;
    if (teleprompterElement) {
      teleprompterElement.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (teleprompterElement) {
        teleprompterElement.removeEventListener('mousemove', handleMouseMove);
      }
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={controlsRef}
      className={cn(
        "fixed bottom-8 left-1/2 transform -translate-x-1/2 rounded-2xl px-12 py-8",
        "flex items-center space-x-12 transition-all duration-700 ease-in-out z-50",
        "bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl",
        "border border-white/10 shadow-2xl",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <Button
          ref={playButtonRef}
          type="button"
          variant="ghost"
          size="icon"
          onClick={onTogglePlay}
          className={cn(
            "w-16 h-16 rounded-2xl transition-all duration-300",
            "hover:scale-105 active:scale-95 relative group",
            "bg-gradient-to-b from-white/10 to-white/5",
            "hover:from-white/15 hover:to-white/10",
            "border border-white/20 hover:border-white/30",
            "text-white shadow-lg"
          )}
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </Button>
        <div className="flex items-center space-x-2 text-sm text-white/70 font-medium">
          <Space size={14} /> <span>Space</span>
        </div>
      </div>

      <div className="flex flex-col space-y-6 min-w-[280px]">
        <div className="flex items-center space-x-6">
          <Settings2 size={20} className="text-white/70" />
          <Slider
            value={[speed]}
            min={0.1}
            max={10}
            step={0.1}
            onValueChange={value => onSpeedChange(value[0])}
            className="cursor-pointer"
          />
          <span className="text-lg font-semibold text-white min-w-[56px] text-center">
            {speed.toFixed(1)}x
          </span>
        </div>
        <div className="flex items-center justify-center space-x-8 text-sm text-white/70 font-medium">
          <div className="flex items-center space-x-2">
            <ArrowUp size={14} /> <span>Faster</span>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowDown size={14} /> <span>Slower</span>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onExit}
        className={cn(
          "w-16 h-16 rounded-2xl transition-all duration-300",
          "hover:scale-105 active:scale-95",
          "bg-gradient-to-b from-red-500/10 to-red-600/5",
          "hover:from-red-500/20 hover:to-red-600/10",
          "border border-red-500/20 hover:border-red-500/30",
          "text-white/90 hover:text-red-500"
        )}
      >
        <X size={32} />
      </Button>
    </div>
  );
};