import { useLocation, useNavigate } from 'react-router-dom';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import { TeleprompterControls } from '@/components/TeleprompterControls';
import { TeleprompterText } from '@/components/TeleprompterText';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TeleprompterState {
  script: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
}

export const Teleprompter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lines, setLines] = useState<string[][]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
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
    const scriptLines = script.split('\n').map(line => 
      line.split(/\s+/).filter(word => word.length > 0)
    );
    setLines(scriptLines);
    setEditableScript(script);
  }, [script, navigate]);

  useEffect(() => {
    if (isPlaying) {
      const wordInterval = setInterval(() => {
        setCurrentWordIndex(prev => {
          const currentLine = lines[currentLineIndex];
          if (!currentLine) return prev;
          
          if (prev >= currentLine.length - 1) {
            if (currentLineIndex >= lines.length - 1) {
              clearInterval(wordInterval);
              togglePlay();
              return prev;
            }
            setCurrentLineIndex(curr => curr + 1);
            return 0;
          }
          return prev + 1;
        });
      }, 60000 / (speed * 200));
      
      return () => clearInterval(wordInterval);
    }
  }, [isPlaying, speed, lines, currentLineIndex, togglePlay]);

  useEffect(() => {
    if (highlightRef.current) {
      updateScrollPosition(highlightRef.current);
    }
  }, [currentWordIndex, currentLineIndex, updateScrollPosition]);

  const handleExit = useCallback(() => {
    reset();
    setCurrentWordIndex(0);
    setCurrentLineIndex(0);
    navigate('/');
  }, [reset, navigate]);

  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      const scriptLines = editableScript.split('\n').map(line => 
        line.split(/\s+/).filter(word => word.length > 0)
      );
      setLines(scriptLines);
      setCurrentWordIndex(0);
      setCurrentLineIndex(0);
    }
    setIsEditing(!isEditing);
  }, [isEditing, editableScript]);

  const handleWordClick = useCallback((lineIndex: number, wordIndex: number) => {
    setCurrentLineIndex(lineIndex);
    setCurrentWordIndex(wordIndex);
  }, []);

  const handleRestart = useCallback(() => {
    reset();
    setCurrentWordIndex(0);
    setCurrentLineIndex(0);
  }, [reset]);

  if (!script) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      
      <div className="fixed top-8 left-8 z-[100] flex items-center gap-4">
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
          className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/10"
        >
          <Edit2 className="h-6 w-6" />
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
          <TeleprompterText
            lines={lines}
            currentLineIndex={currentLineIndex}
            currentWordIndex={currentWordIndex}
            highlightRef={highlightRef}
            handleWordClick={handleWordClick}
            fontSize={fontSize}
            fontFamily={fontFamily}
            textColor={textColor}
          />
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