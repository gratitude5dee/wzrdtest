import { useLocation, useNavigate } from 'react-router-dom';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import { TeleprompterControls } from '@/components/TeleprompterControls';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface TeleprompterProps {
  initialText?: string;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
}

const Teleprompter = ({ 
  initialText,
  fontSize: initialFontSize,
  fontFamily: initialFontFamily,
  textColor: initialTextColor 
}: TeleprompterProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const locationState = location.state as { script: string; fontSize: number; fontFamily: string; textColor: string; };
  
  const script = initialText || locationState?.script;
  const fontSize = initialFontSize || locationState?.fontSize || 44;
  const fontFamily = initialFontFamily || locationState?.fontFamily || 'inter';
  const textColor = initialTextColor || locationState?.textColor || '#F8FAFC';
  
  const highlightRef = useRef<HTMLSpanElement>(null);
  
  const {
    isPlaying,
    speed,
    containerRef,
    togglePlay,
    updateSpeed,
    reset,
    updateScrollPosition
  } = useTeleprompter(2);

  useEffect(() => {
    if (!script) {
      navigate('/');
      return;
    }
    setWords(script.split(/\s+/).filter(word => word.length > 0));
  }, [script, navigate]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= words.length - 1) {
            clearInterval(interval);
            togglePlay();
            return prev;
          }
          return prev + 1;
        });
      }, 60000 / (speed * 200));
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, speed, words.length, togglePlay]);

  useEffect(() => {
    if (highlightRef.current) {
      updateScrollPosition(highlightRef.current);
    }
  }, [currentWordIndex, updateScrollPosition]);

  const handleExit = useCallback(() => {
    reset();
    setCurrentWordIndex(0);
    navigate('/');
  }, [reset, navigate]);

  const handleWordClick = useCallback((index: number) => {
    setCurrentWordIndex(index);
  }, []);

  return (
    <div className="min-h-screen bg-teleprompter-bg overflow-hidden relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
        <span className="sr-only">Back to home</span>
      </Button>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      
      <div
        ref={containerRef}
        className="h-screen overflow-hidden relative z-10 smooth-scroll"
      >
        <div 
          className="teleprompter-text"
          style={{
            fontFamily: fontFamily === 'inter' ? 'Inter' : 
                       fontFamily === 'cal-sans' ? 'Cal Sans' : fontFamily,
            fontSize: `${fontSize / 16}rem`,
            color: textColor,
          }}
        >
          {words.map((word, index) => (
            <span
              key={index}
              ref={index === currentWordIndex ? highlightRef : null}
              onClick={() => handleWordClick(index)}
              className={`inline-block mx-1 px-1 py-0.5 rounded transition-all duration-300 cursor-pointer hover:bg-teleprompter-highlight/20 ${
                index === currentWordIndex
                  ? 'text-teleprompter-highlight scale-110 bg-teleprompter-highlight/10 font-semibold animate-highlight'
                  : index < currentWordIndex
                  ? `opacity-60`
                  : `opacity-40`
              }`}
              style={{
                color: index === currentWordIndex ? '#3B82F6' : undefined
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-teleprompter-bg via-teleprompter-bg/80 to-transparent pointer-events-none z-20" />
      <div className="fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-teleprompter-bg via-teleprompter-bg/80 to-transparent pointer-events-none z-20" />
      
      <TeleprompterControls
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={togglePlay}
        onSpeedChange={updateSpeed}
        onExit={handleExit}
      />
    </div>
  );
};

export default Teleprompter;