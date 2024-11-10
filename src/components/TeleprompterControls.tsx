import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Play, Pause } from 'lucide-react';
import { useEffect } from 'react';

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
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onTogglePlay]);

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 rounded-2xl px-12 py-10 flex items-center space-x-12 bg-black/90 backdrop-blur-xl z-50">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onTogglePlay}
        className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
      </Button>

      <div className="flex flex-col space-y-4 min-w-[280px]">
        <div className="flex items-center space-x-6">
          <span className="text-sm text-white/70">Speed</span>
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
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onExit}
        className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-red-500/20 text-white/90 hover:text-red-500 transition-all duration-300"
      >
        <X size={32} />
      </Button>
    </div>
  );
};