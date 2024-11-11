import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Play, Pause, Settings2, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from "framer-motion";

interface TeleprompterControlsProps {
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onSpeedChange: (value: number) => void;
  onExit: () => void;
  onRestart: () => void;
}

export const TeleprompterControls = ({
  isPlaying,
  speed,
  onTogglePlay,
  onSpeedChange,
  onExit,
  onRestart
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

    // Check if mouse is near the controls
    if (controlsRef.current) {
      const rect = controlsRef.current.getBoundingClientRect();
      const isNearControls = e.clientY <= (rect.bottom + 100); // 100px buffer zone

      if (!isNearControls) {
        hideTimeout.current = setTimeout(() => {
          setIsVisible(false);
        }, 1000);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [handleMouseMove]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: isVisible ? 0 : -20,
          transition: {
            opacity: { duration: 0.3, ease: "easeOut" },
            y: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
          }
        }}
        exit={{ opacity: 0, y: -20 }}
        ref={controlsRef}
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 rounded-3xl px-12 py-6",
          "flex items-center space-x-12 transition-all duration-300 ease-in-out z-50",
          "bg-gradient-to-b from-[#FFF8F0]/95 to-[#FFF4E8]/95 backdrop-blur-xl",
          "border border-[#785340]/10 shadow-[0_8px_32px_-4px_rgba(120,83,64,0.1)]",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
        )}
      >
        <div className="flex items-center space-x-8">
          <Button
            ref={playButtonRef}
            type="button"
            variant="ghost"
            size="icon"
            onClick={onTogglePlay}
            className={cn(
              "w-16 h-16 rounded-2xl transition-all duration-300",
              "hover:scale-105 active:scale-95 relative group",
              "bg-gradient-to-b from-[#785340]/10 to-[#785340]/5",
              "hover:from-[#785340]/15 hover:to-[#785340]/10",
              "border border-[#785340]/20 hover:border-[#785340]/30",
              "text-[#785340] shadow-lg"
            )}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRestart}
            className={cn(
              "w-16 h-16 rounded-2xl transition-all duration-300",
              "hover:scale-105 active:scale-95",
              "bg-gradient-to-b from-[#785340]/10 to-[#785340]/5",
              "hover:from-[#785340]/15 hover:to-[#785340]/10",
              "border border-[#785340]/20 hover:border-[#785340]/30",
              "text-[#785340] shadow-lg"
            )}
          >
            <RotateCcw size={32} />
          </Button>
        </div>

        <div className="flex flex-col space-y-6 min-w-[280px]">
          <div className="flex items-center space-x-6">
            <Settings2 size={20} className="text-[#785340]/70" />
            <Slider
              value={[speed]}
              min={0.1}
              max={10}
              step={0.1}
              onValueChange={value => onSpeedChange(value[0])}
              className="cursor-pointer"
            />
            <span className="text-lg font-semibold text-[#785340] min-w-[56px] text-center">
              {speed.toFixed(1)}x
            </span>
          </div>
          <div className="flex items-center justify-center space-x-8 text-sm text-[#785340]/70 font-medium">
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
            "bg-gradient-to-b from-[#785340]/10 to-[#785340]/5",
            "hover:from-[#785340]/20 hover:to-[#785340]/10",
            "border border-[#785340]/20 hover:border-[#785340]/30",
            "text-[#785340]/90 hover:text-[#785340]"
          )}
        >
          <X size={32} />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};