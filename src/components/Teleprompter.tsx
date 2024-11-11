import { useLocation, useNavigate } from 'react-router-dom';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import { TeleprompterControls } from '@/components/TeleprompterControls';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, ArrowLeft } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TeleprompterState {
  script: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
}

export const Teleprompter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const { script, fontSize, fontFamily, textColor } = (location.state as TeleprompterState) || {};
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
    setEditedText(script);
  }, [script, navigate]);

  useEffect(() => {
    if (isPlaying && !isEditing) {
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
  }, [isPlaying, speed, words.length, togglePlay, isEditing]);

  useEffect(() => {
    if (highlightRef.current && !isEditing) {
      updateScrollPosition(highlightRef.current);
    }
  }, [currentWordIndex, updateScrollPosition, isEditing]);

  const handleExit = useCallback(() => {
    reset();
    setCurrentWordIndex(0);
    navigate('/');
  }, [reset, navigate]);

  const handleWordClick = useCallback((index: number) => {
    if (!isEditing) {
      setCurrentWordIndex(index);
    }
  }, [isEditing]);

  const handleEditToggle = () => {
    if (isEditing) {
      const newWords = editedText.split(/\s+/).filter(word => word.length > 0);
      setWords(newWords);
      setCurrentWordIndex(Math.min(currentWordIndex, newWords.length - 1));
      toast.success('Text updated successfully');
    }
    setIsEditing(!isEditing);
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="absolute top-6 left-6 z-50 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleEditToggle}
        className="absolute top-6 right-6 z-50 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105"
      >
        <Edit2 className="h-6 w-6" />
      </Button>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      
      <div
        ref={containerRef}
        className="h-screen overflow-hidden relative z-10 smooth-scroll px-8"
      >
        {isEditing ? (
          <div className="max-w-4xl mx-auto pt-24">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[60vh] w-full bg-black/30 border-white/20 text-white resize-none p-6 rounded-xl"
              style={{
                fontFamily: fontFamily === 'inter' ? 'Inter' : 
                         fontFamily === 'cal-sans' ? 'Cal Sans' : fontFamily,
                fontSize: `${fontSize / 16}rem`,
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                wordSpacing: '0.2em'
              }}
            />
          </div>
        ) : (
          <div 
            className="teleprompter-text"
            style={{
              fontFamily: fontFamily === 'inter' ? 'Inter' : 
                       fontFamily === 'cal-sans' ? 'Cal Sans' : fontFamily,
              fontSize: `${fontSize / 16}rem`,
            }}
          >
            {words.map((word, index) => (
              <span
                key={index}
                ref={index === currentWordIndex ? highlightRef : null}
                onClick={() => handleWordClick(index)}
                className={cn(
                  "inline-block px-2 py-1 rounded cursor-pointer transition-all duration-300",
                  index === currentWordIndex && "word-highlight",
                  index < currentWordIndex && "word-past",
                  index > currentWordIndex && "word-future",
                  "hover:opacity-100"
                )}
              >
                {word}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-20" />
      <div className="fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-20" />
      
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