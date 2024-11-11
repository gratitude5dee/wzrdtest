import { useLocation, useNavigate } from 'react-router-dom';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import { TeleprompterControls } from '@/components/TeleprompterControls';
import { TeleprompterEditor } from '@/components/teleprompter/TeleprompterEditor';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { TeleprompterContainer } from './teleprompter/TeleprompterContainer';
import { TeleprompterWord } from './teleprompter/TeleprompterWord';
import { TeleprompterScroll } from './teleprompter/TeleprompterScroll';

interface TeleprompterProps {
  initialScript?: string;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  autoStart?: boolean;
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
  autoStart = false,
}: TeleprompterProps = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editableScript, setEditableScript] = useState('');
  const { script, fontSize, fontFamily, textColor } = (location.state as TeleprompterState) || {
    script: initialScript,
    fontSize: initialFontSize,
    fontFamily: initialFontFamily,
    textColor: initialTextColor,
  };
  
  const highlightRef = useRef<HTMLSpanElement>(null);
  const firstWordRef = useRef<HTMLSpanElement>(null);
  const scrollIntervalRef = useRef<number>();
  
  const {
    isPlaying,
    speed,
    togglePlay,
    updateSpeed,
    reset,
    containerRef,
  } = useTeleprompter(2, autoStart);

  useKeyboardShortcuts(updateSpeed, togglePlay, speed);

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
      scrollIntervalRef.current = window.setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= words.length - 1) {
            clearInterval(scrollIntervalRef.current);
            togglePlay();
            return prev;
          }
          return prev + 1;
        });
      }, 60000 / (speed * 200));
      
      return () => {
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
        }
      };
    }
  }, [isPlaying, speed, words.length, togglePlay]);

  const handleWordClick = useCallback((index: number) => {
    setCurrentWordIndex(index);
    if (isPlaying) {
      togglePlay();
    }
  }, [isPlaying, togglePlay]);

  const handleExit = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
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

  const handleRestart = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
    reset();
    setCurrentWordIndex(0);
  }, [reset]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      
      <div className="fixed top-8 w-full px-8 flex justify-between items-center z-[100]">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExit}
          className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleEditToggle}
          className={cn(
            "w-12 h-12 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-lg border",
            isEditing ? 
              "bg-white/90 text-black hover:bg-white border-black/10" :
              "bg-black/40 hover:bg-black/60 text-white border-white/10"
          )}
        >
          <Edit2 className="h-6 w-6" />
        </Button>
      </div>
      
      <TeleprompterContainer 
        containerRef={containerRef}
        firstWordRef={firstWordRef}
        autoStart={autoStart}
      >
        {isEditing ? (
          <TeleprompterEditor
            editableScript={editableScript}
            setEditableScript={setEditableScript}
            fontFamily={fontFamily}
            fontSize={fontSize}
            textColor={textColor}
          />
        ) : (
          <div 
            className="teleprompter-text max-w-4xl mx-auto"
            style={{
              fontFamily: fontFamily === 'inter' ? 'Inter' : 
                         fontFamily === 'cal-sans' ? 'Cal Sans' : fontFamily,
              fontSize: `${fontSize / 16}rem`,
              color: textColor,
            }}
          >
            {words.map((word, index) => (
              <TeleprompterWord
                key={index}
                word={word}
                index={index}
                currentWordIndex={currentWordIndex}
                onClick={handleWordClick}
                highlightRef={index === currentWordIndex ? highlightRef : 
                            index === 0 ? firstWordRef : null}
                textColor={textColor}
              />
            ))}
          </div>
        )}
      </TeleprompterContainer>

      <TeleprompterScroll
        highlightRef={highlightRef}
        containerRef={containerRef}
        currentWordIndex={currentWordIndex}
      />
      
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