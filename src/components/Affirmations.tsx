import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, ArrowLeft, Edit2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const affirmationsText = `I am worthy of love and respect.
Each day brings new opportunities for growth and learning.
I trust in my journey and embrace each moment with gratitude.
My potential is limitless, and I have the power to achieve my dreams.
I radiate positivity and attract success naturally.
I am grateful for all the abundance in my life.
I choose happiness and spread joy to others.
I am exactly where I need to be right now.
My future is bright and full of possibilities.
I deserve all the good things life has to offer.
I am resilient and can overcome any challenge.
My thoughts and feelings are valid and deserving of expression.
I attract positive energy and release what no longer serves me.
Every day in every way, I am getting better and better.
I am surrounded by love and support.
My presence makes a positive difference in the world.
I embrace change as an opportunity for growth.
I am at peace with my past and excited about my future.
My creativity flows freely and inspires others.
I trust my intuition and inner wisdom to guide me.
I am confident in my abilities and trust myself completely.
I attract meaningful relationships and nurturing friendships.
My mind is clear, focused, and ready for success.
I choose to be happy and create joy in my life.
I am becoming stronger and more confident each day.`;

export const Affirmations = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editableScript, setEditableScript] = useState(affirmationsText);
  
  const highlightRef = useRef<HTMLSpanElement>(null);
  const firstWordRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number>();

  useEffect(() => {
    setWords(affirmationsText.split(/\s+/).filter(word => word.length > 0));
    setEditableScript(affirmationsText);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      scrollIntervalRef.current = window.setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= words.length - 1) {
            clearInterval(scrollIntervalRef.current);
            setIsPlaying(false);
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
  }, [isPlaying, speed, words.length]);

  const handleWordClick = useCallback((index: number) => {
    setCurrentWordIndex(index);
    if (isPlaying) {
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const handleRestart = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
    setIsPlaying(false);
    setCurrentWordIndex(0);
  }, []);

  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      setWords(editableScript.split(/\s+/).filter(word => word.length > 0));
      setCurrentWordIndex(0);
    }
    setIsEditing(!isEditing);
  }, [isEditing, editableScript]);

  useEffect(() => {
    if (highlightRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const wordRect = highlightRef.current.getBoundingClientRect();
      
      const targetScroll = (
        containerRef.current.scrollTop + 
        (wordRect.top - containerRect.top) - 
        (containerRect.height / 2) + 
        (wordRect.height / 2)
      );
      
      containerRef.current.scrollTo({
        top: targetScroll,
        behavior: isPlaying ? 'auto' : 'smooth'
      });
    }
  }, [currentWordIndex, isPlaying]);

  return (
    <motion.div 
      className="fixed inset-0 min-h-screen w-full bg-[#FFF8F6] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      
      <div className="fixed top-8 w-full px-8 flex justify-between items-center z-[100]">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/home')}
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

      <div
        ref={containerRef}
        className="fixed inset-0 overflow-y-auto overflow-x-hidden scroll-smooth px-4 md:px-8 lg:px-16"
      >
        <div className="min-h-[200vh] w-full flex items-center justify-center">
          <div className="py-[50vh]">
            {isEditing ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-5xl mx-auto h-[70vh] px-4"
              >
                <Textarea
                  value={editableScript}
                  onChange={(e) => setEditableScript(e.target.value)}
                  className="w-full h-full bg-transparent border-none resize-none p-8 focus:ring-0 text-[2.75rem] leading-relaxed"
                  style={{
                    fontFamily: 'Cal Sans',
                    color: '#785340',
                  }}
                />
              </motion.div>
            ) : (
              <div 
                className="teleprompter-text max-w-4xl mx-auto"
                style={{
                  fontFamily: 'Cal Sans',
                  fontSize: '2.75rem',
                  color: '#785340',
                }}
              >
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    ref={index === currentWordIndex ? highlightRef : 
                         index === 0 ? firstWordRef : null}
                    onClick={() => handleWordClick(index)}
                    className={cn(
                      "relative inline-block mx-2 px-2 py-1 rounded-xl cursor-pointer transition-all duration-500",
                      index === currentWordIndex ? "scale-110 font-semibold" : "",
                      index < currentWordIndex ? "opacity-40" : "opacity-80"
                    )}
                    initial={false}
                    animate={{
                      scale: index === currentWordIndex ? 1.1 : 1,
                      y: index === currentWordIndex ? -8 : 0,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        mass: 1
                      }
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -4,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {word}
                    {index === currentWordIndex && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0.2, 0.6, 0.2],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          background: '#78534010'
                        }}
                      />
                    )}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-[#FFF8F6] via-[#FFF8F6]/80 to-transparent pointer-events-none z-20" />
      <div className="fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FFF8F6] via-[#FFF8F6]/80 to-transparent pointer-events-none z-20" />
      
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-lg rounded-full border border-[#785340]/10 shadow-lg z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRestart}
          className="w-10 h-10 rounded-full hover:bg-[#785340]/10"
        >
          <RotateCcw className="h-5 w-5 text-[#785340]" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
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
              onValueChange={([value]) => setSpeed(value)}
              className="[&_[role=slider]]:bg-[#785340] [&_[role=slider]]:border-[#785340]"
            />
          </div>
          <div className="flex flex-col items-center text-xs text-[#785340]/60 gap-1">
            <span>↑ Faster</span>
            <span>↓ Slower</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};