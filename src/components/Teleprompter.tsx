import { useLocation, useNavigate } from 'react-router-dom';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import { TeleprompterControls } from '@/components/TeleprompterControls';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TeleprompterProps {
  initialScript?: string;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
}

interface TeleprompterState {
  script: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
}

export const Teleprompter = ({
  initialScript,
  fontSize: initialFontSize,
  fontFamily: initialFontFamily,
  textColor: initialTextColor,
}: TeleprompterProps = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editableScript, setEditableScript] = useState('');
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
    setEditableScript(script);
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

  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      setWords(editableScript.split(/\s+/).filter(word => word.length > 0));
      setCurrentWordIndex(0);
    }
    setIsEditing(!isEditing);
  }, [isEditing, editableScript]);

  const handleWordClick = useCallback((index: number) => {
    setCurrentWordIndex(index);
  }, []);

  const handleRestart = useCallback(() => {
    reset();
    setCurrentWordIndex(0);
  }, [reset]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      
      {/* Navigation Controls - Updated positioning and styling */}
      <div className="fixed top-8 z-[100] flex items-center gap-4 w-full px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExit}
          className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="flex-1" /> {/* Spacer */}

        <Button
          variant="ghost"
          size="icon"
          onClick={handleEditToggle}
          className={cn(
            "w-12 h-12 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-lg border",
            isEditing 
              ? "bg-[#785340]/90 hover:bg-[#785340] text-white border-[#785340]/20"
              : "bg-black/40 hover:bg-black/60 text-white border-white/10",
            "relative overflow-hidden"
          )}
        >
          <Edit2 className={cn(
            "h-6 w-6 transition-transform duration-300",
            isEditing && "rotate-12 scale-110"
          )} />
          {isEditing && (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#785340]/20 to-transparent animate-gradient" />
          )}
        </Button>
      </div>
      
      <div
        ref={containerRef}
        className={cn(
          "h-screen overflow-hidden relative z-10 smooth-scroll",
          "px-4 md:px-8 lg:px-16"
        )}
      >
        {isEditing ? (
          <Textarea
            value={editableScript}
            onChange={(e) => setEditableScript(e.target.value)}
            className={cn(
              "w-full h-full bg-transparent border-none resize-none p-8 focus:ring-0 teleprompter-text",
              "placeholder:text-white/40"
            )}
            style={{
              fontFamily: fontFamily === 'inter' ? 'Inter' : 
                         fontFamily === 'cal-sans' ? 'Cal Sans' : fontFamily,
              fontSize: `${fontSize / 16}rem`,
              color: textColor,
            }}
          />
        ) : (
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
                    ? 'text-teleprompter-highlight scale-110 bg-teleprompter-highlight/10 font-semibold'
                    : index < currentWordIndex
                    ? `${textColor}/60`
                    : `${textColor}/40`
                }`}
                style={{
                  color: index === currentWordIndex ? '#3B82F6' : undefined
                }}
              >
                {word}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-20" />
      <div className="fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-20" />
      
      <TeleprompterControls
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={togglePlay}
        onSpeedChange={updateSpeed}
        onExit={handleExit}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default Teleprompter;
