import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { PlayCircle, PauseCircle, RotateCcw, Settings } from 'lucide-react';

interface TeleprompterProps {
  text: string;
  speed?: number;
}

export function Teleprompter({ text, speed = 50 }: TeleprompterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollSpeed, setScrollSpeed] = useState(speed);

  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      if (isPlaying && containerRef.current) {
        setScrollPosition((prev) => {
          const newPosition = prev + scrollSpeed * 0.01;
          const maxScroll = containerRef.current!.scrollHeight - containerRef.current!.clientHeight;
          
          if (newPosition >= maxScroll) {
            setIsPlaying(false);
            return maxScroll;
          }
          
          return newPosition;
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, scrollSpeed]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  const handleReset = () => {
    setIsPlaying(false);
    setScrollPosition(0);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white rounded-3xl overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-900">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="text-white hover:bg-gray-800"
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-white hover:bg-gray-800"
        >
          {isPlaying ? (
            <PauseCircle className="h-8 w-8" />
          ) : (
            <PlayCircle className="h-8 w-8" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-800"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden p-8"
        style={{ 
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000000 10%, #000000 90%, rgba(0,0,0,0) 100%)'
        }}
      >
        <div className="text-center text-4xl font-medium leading-relaxed">
          {text}
        </div>
      </div>
    </div>
  );
}