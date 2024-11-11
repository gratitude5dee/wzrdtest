import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Play, Pause, Settings2, ArrowUp, ArrowDown, Space } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

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
  const controlsRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const hideTimeout = useRef<NodeJS.Timeout>();

  useKeyboardShortcuts(onSpeedChange, onTogglePlay, speed);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setIsVisible(true);

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
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 rounded-2xl px-12 py-8 
        flex items-center space-x-12 transition-all duration-700 ease-in-out z-50
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
        bg-cream-100/95 backdrop-blur-xl border border-cream-200 shadow-xl`}
    >
      <div className="flex flex-col items-center space-y-4">
        <Button
          ref={playButtonRef}
          type="button"
          variant="ghost"
          size="icon"
          onClick={onTogglePlay}
          className="w-16 h-16 rounded-2xl bg-cream-200 hover:bg-cream-300 text-cream-600 
            transition-all duration-300 hover:scale-105 active:scale-95 relative group"
        >
          <div className="absolute inset-0 bg-cream-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </Button>
        <div className="flex items-center space-x-2 text-sm text-cream-600/70 font-medium">
          <Space size={14} /> <span>Space</span>
        </div>
      </div>

      <div className="flex flex-col space-y-6 min-w-[280px]">
        <div className="flex items-center space-x-6">
          <Settings2 size={20} className="text-cream-600/70" />
          <Slider
            value={[speed]}
            min={0.1}
            max={10}
            step={0.1}
            onValueChange={value => onSpeedChange(value[0])}
            className="cursor-pointer"
          />
          <span className="text-lg font-semibold text-cream-600 min-w-[56px] text-center">
            {speed.toFixed(1)}x
          </span>
        </div>
        <div className="flex items-center justify-center space-x-8 text-sm text-cream-600/70 font-medium">
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
        className="w-16 h-16 rounded-2xl bg-cream-200 hover:bg-red-100 text-cream-600 hover:text-red-500 
          transition-all duration-300 hover:scale-105 active:scale-95 relative group"
      >
        <div className="absolute inset-0 bg-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <X size={32} />
      </Button>
    </div>
  );
};