import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TeleprompterTextProps {
  words: string[];
  currentWordIndex: number;
  handleWordClick: (index: number) => void;
  highlightRef: React.RefObject<HTMLSpanElement>;
  fontFamily: string;
  fontSize: number;
  textColor: string;
}

export const TeleprompterText = ({
  words,
  currentWordIndex,
  handleWordClick,
  highlightRef,
  fontFamily,
  fontSize,
  textColor,
}: TeleprompterTextProps) => {
  return (
    <motion.div 
      className="teleprompter-text"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        fontFamily: fontFamily === 'inter' ? 'Inter' : 
                   fontFamily === 'cal-sans' ? 'Cal Sans' : fontFamily,
        fontSize: `${fontSize / 16}rem`,
        color: textColor,
        letterSpacing: "-0.02em",
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          ref={index === currentWordIndex ? highlightRef : null}
          onClick={() => handleWordClick(index)}
          className={cn(
            "word-container relative inline-block mx-1 px-1 py-0.5 rounded-lg cursor-pointer transition-all duration-300",
            index === currentWordIndex && "word-highlight",
            index < currentWordIndex ? "opacity-30" : "opacity-20"
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
            y: -2,
            transition: { duration: 0.2 }
          }}
        >
          {word}
          {index === currentWordIndex && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-[#785340]/5"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.span>
      ))}
    </motion.div>
  );
};