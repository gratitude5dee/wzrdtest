import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface TeleprompterTextProps {
  words: string[];
  currentWordIndex: number;
  handleWordClick: (index: number) => void;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  updateScrollPosition: (element: HTMLElement) => void;
}

export const TeleprompterText = ({
  words,
  currentWordIndex,
  handleWordClick,
  fontFamily,
  fontSize,
  textColor,
  updateScrollPosition,
}: TeleprompterTextProps) => {
  const highlightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (highlightRef.current) {
      updateScrollPosition(highlightRef.current);
    }
  }, [currentWordIndex, updateScrollPosition]);

  return (
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
        <motion.span
          key={index}
          ref={index === currentWordIndex ? highlightRef : null}
          onClick={() => handleWordClick(index)}
          className={cn(
            "word-container relative inline-block mx-2 px-2 py-1 rounded-xl cursor-pointer transition-all duration-500",
            index === currentWordIndex && "word-highlight",
            index < currentWordIndex ? "opacity-40" : "opacity-80"
          )}
          initial={false}
          animate={{
            scale: index === currentWordIndex ? 1.15 : 1,
            y: index === currentWordIndex ? -12 : 0,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 1
            }
          }}
          whileHover={{
            scale: 1.05,
            y: -4,
            transition: { duration: 0.3 }
          }}
        >
          {word}
          {index === currentWordIndex && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-teleprompter-highlight/5"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.span>
      ))}
    </div>
  );
};