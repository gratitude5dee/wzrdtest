import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Play, Pause, Settings2 } from 'lucide-react';

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
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 rounded-2xl px-12 py-10 flex items-center space-x-12 backdrop-blur-xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={onTogglePlay}
        className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-white/15 text-white"
      >
        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
      </Button>

      <div className="flex items-center space-x-6 min-w-[280px]">
        <Settings2 size={24} className="text-white/70" />
        <Slider
          value={[speed]}
          min={0.1}
          max={10}
          step={0.1}
          onValueChange={value => onSpeedChange(value[0])}
        />
        <span className="text-lg font-semibold text-white min-w-[56px] text-center">
          {speed.toFixed(1)}x
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onExit}
        className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-red-500/20 text-white/90 hover:text-red-500"
      >
        <X size={32} />
      </Button>
    </div>
  );
};