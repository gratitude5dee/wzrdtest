import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { TeleprompterControls } from "./TeleprompterControls";
import { AffirmationsHeader } from "./affirmations/AffirmationsHeader";
import { AffirmationsEditor } from "./affirmations/AffirmationsEditor";
import { AffirmationsDisplay } from "./affirmations/AffirmationsDisplay";

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
      
      <AffirmationsHeader isEditing={isEditing} onEditToggle={handleEditToggle} />

      <div
        ref={containerRef}
        className="fixed inset-0 overflow-y-auto overflow-x-hidden scroll-smooth px-4 md:px-8 lg:px-16"
      >
        <div className="min-h-[200vh] w-full flex items-center justify-center">
          <div className="py-[50vh]">
            {isEditing ? (
              <AffirmationsEditor 
                editableScript={editableScript}
                setEditableScript={setEditableScript}
              />
            ) : (
              <AffirmationsDisplay
                words={words}
                currentWordIndex={currentWordIndex}
                highlightRef={highlightRef}
                firstWordRef={firstWordRef}
                handleWordClick={handleWordClick}
              />
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-[#FFF8F6] via-[#FFF8F6]/80 to-transparent pointer-events-none z-20" />
      <div className="fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FFF8F6] via-[#FFF8F6]/80 to-transparent pointer-events-none z-20" />
      
      <TeleprompterControls
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onSpeedChange={setSpeed}
        onExit={handleRestart}
        onRestart={handleRestart}
      />
    </motion.div>
  );
};