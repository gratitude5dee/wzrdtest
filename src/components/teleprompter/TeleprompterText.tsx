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
            "word-container relative inline-block mx-1 px-1 py-0.5 rounded cursor-pointer",
            index === currentWordIndex && "word-highlight",
            index < currentWordIndex ? "opacity-40" : "opacity-30"
          )}
          initial={false}
          animate={{
            scale: index === currentWordIndex ? 1.05 : 1,
            y: index === currentWordIndex ? -4 : 0,
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            scale: {
              type: "spring",
              stiffness: 400,
              damping: 30
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};