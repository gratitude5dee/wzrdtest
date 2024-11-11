import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TeleprompterControlsProps {
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  onExit: () => void;
  onRestart: () => void;
}

export const TeleprompterControls = ({
  isPlaying,
  speed,
  onTogglePlay,
  onSpeedChange,
  onRestart,
}: TeleprompterControlsProps) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-lg rounded-full border border-[#785340]/10 shadow-lg z-50">
      <Button
        variant="ghost"
        size="icon"
        onClick={onRestart}
        className="w-10 h-10 rounded-full hover:bg-[#785340]/10"
      >
        <RotateCcw className="h-5 w-5 text-[#785340]" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onTogglePlay}
        className="w-12 h-12 rounded-full hover:bg-[#785340]/10"
      >
        {isPlaying ? (
          <Pause className="h-6 w-6 text-[#785340]" />
        ) : (
          <Play className="h-6 w-6 text-[#785340]" />
        )}
      </Button>

      <div className="flex items-center gap-4 px-4">
        <span className="text-sm text-[#785340] font-medium">
          {speed.toFixed(1)}x
        </span>
        <div className="w-32">
          <Slider
            value={[speed]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={([value]) => onSpeedChange(value)}
            className="[&_[role=slider]]:bg-[#785340] [&_[role=slider]]:border-[#785340]"
          />
        </div>
        <div className="flex flex-col items-center text-xs text-[#785340]/60 gap-1">
          <span>↑ Faster</span>
          <span>↓ Slower</span>
        </div>
      </div>
    </div>
  );
};