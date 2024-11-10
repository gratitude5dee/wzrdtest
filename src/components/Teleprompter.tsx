import { useLocation, useNavigate } from 'react-router-dom';
import { TeleprompterControls } from '@/components/TeleprompterControls';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface TeleprompterProps {
  text?: string;
}

export const Teleprompter = ({ text = '' }: TeleprompterProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptText = location.state?.text || text;

  useEffect(() => {
    if (!scriptText) {
      navigate('/');
      return;
    }
  }, [scriptText, navigate]);

  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      if (isPlaying && containerRef.current) {
        setScrollPosition((prev) => {
          const newPosition = prev + speed * 0.5;
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
  }, [isPlaying, speed]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 rounded-full bg-white/10 hover:bg-white/20 text-white"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      
      <div
        ref={containerRef}
        className="h-screen overflow-hidden relative z-10 smooth-scroll"
      >
        <div className="teleprompter-text">
          {scriptText}
        </div>
      </div>
      
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-20" />
      <div className="fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20" />
      
      <TeleprompterControls
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={handleTogglePlay}
        onSpeedChange={handleSpeedChange}
        onExit={handleBack}
      />
    </div>
  );
};