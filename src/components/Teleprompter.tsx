import { useLocation, useNavigate } from 'react-router-dom';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import { TeleprompterControls } from '@/components/TeleprompterControls';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { TeleprompterText } from './teleprompter/TeleprompterText';
import { TeleprompterEditor } from './teleprompter/TeleprompterEditor';

interface TeleprompterProps {
  initialScript?: string;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
}

export const Teleprompter = ({ 
  initialScript,
  fontSize: initialFontSize,
  fontFamily: initialFontFamily,
  textColor: initialTextColor 
}: TeleprompterProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editableScript, setEditableScript] = useState('');
  const highlightRef = useRef<HTMLSpanElement>(null);
  
  const { script, fontSize, fontFamily, textColor } = (location.state as any) || {
    script: initialScript,
    fontSize: initialFontSize,
    fontFamily: initialFontFamily,
    textColor: initialTextColor
  };

  const {
    isPlaying,
    speed,
    containerRef,
    togglePlay,
    updateSpeed,
    reset,
    updateScrollPosition
  } = useTeleprompter(2);

  const handleExit = useCallback(() => {
    reset();
    setCurrentWordIndex(0);
    navigate('/home');
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

  useEffect(() => {
    if (!script) {
      navigate('/');
      return;
    }
    setWords(script.split(/\s+/).filter(word => word.length > 0));
    setEditableScript(script);
  }, [script, navigate]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= words.length - 1) {
            clearInterval(intervalId);
            togglePlay();
            return prev;
          }
          return prev + 1;
        });
      }, 60000 / (speed * 200));
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, speed, words.length, togglePlay]);

  useEffect(() => {
    if (highlightRef.current) {
      updateScrollPosition(highlightRef.current);
    }
  }, [currentWordIndex, updateScrollPosition]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFF4E8] to-[#FFF8F0] overflow-hidden relative"
    >
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,83,64,0.05)_0%,transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(120,83,64,0.03)_0%,transparent_100%)] pointer-events-none" />
      
      <div className="fixed top-8 left-8 z-[100] flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExit}
          className="w-12 h-12 rounded-full bg-[#785340]/5 hover:bg-[#785340]/10 text-[#785340] transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-[#785340]/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleEditToggle}
          className="w-12 h-12 rounded-full bg-[#785340]/5 hover:bg-[#785340]/10 text-[#785340] transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-[#785340]/10"
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
        <AnimatePresence mode="wait">
          {isEditing ? (
            <TeleprompterEditor
              editableScript={editableScript}
              setEditableScript={setEditableScript}
              fontFamily={fontFamily}
              fontSize={fontSize}
              textColor={textColor}
            />
          ) : (
            <TeleprompterText
              words={words}
              currentWordIndex={currentWordIndex}
              handleWordClick={handleWordClick}
              highlightRef={highlightRef}
              fontFamily={fontFamily}
              fontSize={fontSize}
              textColor={textColor}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Enhanced gradient overlays */}
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-[#FFF8F0] via-[#FFF8F0]/80 to-transparent pointer-events-none z-20" />
      <div className="fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FFF8F0] via-[#FFF8F0]/80 to-transparent pointer-events-none z-20" />
      
      <TeleprompterControls
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={togglePlay}
        onSpeedChange={updateSpeed}
        onExit={handleExit}
        onRestart={reset}
      />
    </motion.div>
  );
};