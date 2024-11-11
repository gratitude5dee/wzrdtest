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
      transition={{ duration: 0.3 }}
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
            "word-container",
            index === currentWordIndex && "word-highlight",
            index < currentWordIndex ? "word-past" : "word-future"
          )}
          initial={false}
          animate={{
            scale: index === currentWordIndex ? 1.03 : 1,
            opacity: index === currentWordIndex ? 1 : 
                     index < currentWordIndex ? 0.6 : 0.4,
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
            scale: {
              type: "spring",
              stiffness: 300,
              damping: 25
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};