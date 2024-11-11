import { useLocation, useNavigate } from 'react-router-dom';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import { TeleprompterControls } from '@/components/TeleprompterControls';
import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const { script, fontSize, fontFamily, textColor } = (location.state as any) || {
    script: initialScript,
    fontSize: initialFontSize,
    fontFamily: initialFontFamily,
    textColor: initialTextColor
  };
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
      }, 60000 / (speed * 200)); // Adjusted timing for smoother transitions
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, speed, words.length, togglePlay]);

  useEffect(() => {
    if (highlightRef.current) {
      const element = highlightRef.current;
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      updateScrollPosition(element);
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)] pointer-events-none" />
      
      <div className="fixed top-8 left-8 z-[100] flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/home')}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/10"
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
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          ) : (
            <motion.div 
              key="teleprompter"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="teleprompter-text"
              style={{
                fontFamily: fontFamily === 'inter' ? 'Inter' : 
                         fontFamily === 'cal-sans' ? 'Cal Sans' : fontFamily,
                fontSize: `${fontSize / 16}rem`,
                color: textColor,
              }}
            >
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  ref={index === currentWordIndex ? highlightRef : null}
                  onClick={() => setCurrentWordIndex(index)}
                  className={cn(
                    "inline-block mx-1 px-1 py-0.5 rounded cursor-pointer transition-all duration-300",
                    "hover:bg-white/10",
                    index === currentWordIndex && [
                      "word-highlight scale-110 bg-blue-500/10",
                      "font-semibold shadow-lg shadow-blue-500/20"
                    ],
                    index < currentWordIndex ? "opacity-60" : "opacity-40"
                  )}
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    scale: index === currentWordIndex ? 1.1 : 1,
                    opacity: index === currentWordIndex ? 1 : 
                             index < currentWordIndex ? 0.6 : 0.4
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-20" />
      <div className="fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-20" />
      
      <TeleprompterControls
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={togglePlay}
        onSpeedChange={updateSpeed}
        onExit={() => navigate('/home')}
        onRestart={reset}
      />
    </motion.div>
  );
};
