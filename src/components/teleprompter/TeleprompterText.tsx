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
            "word-container relative",
            index === currentWordIndex && "word-highlight",
            index < currentWordIndex ? "word-past" : "word-future"
          )}
          initial={false}
          animate={{
            scale: index === currentWordIndex ? 1.05 : 1,
            opacity: index === currentWordIndex ? 1 : 
                     index < currentWordIndex ? 0.4 : 0.3,
            y: index === currentWordIndex ? -8 : 0,
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            scale: {
              type: "spring",
              stiffness: 400,
              damping: 30
            },
            y: {
              type: "spring",
              stiffness: 500,
              damping: 35
            }
          }}
        >
          {word}
          {index === currentWordIndex && (
            <motion.div
              className="absolute inset-0 -z-10 rounded-xl bg-[#785340]/5"
              layoutId="highlight"
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          )}
        </motion.span>
      ))}
    </motion.div>
  );
};