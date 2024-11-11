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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      style={{
        fontFamily: fontFamily === 'inter' ? 'Inter' : 
                   fontFamily === 'cal-sans' ? 'Cal Sans' : fontFamily,
        fontSize: `${fontSize / 16}rem`,
        color: textColor,
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          ref={index === currentWordIndex ? highlightRef : null}
          onClick={() => handleWordClick(index)}
          className={cn(
            "inline-block mx-1 px-1 py-0.5 rounded cursor-pointer",
            "hover:bg-white/10 backdrop-blur-sm",
            index === currentWordIndex && "word-highlight",
            index < currentWordIndex ? "word-past" : "word-future"
          )}
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
          initial={false}
          animate={{
            opacity: index === currentWordIndex ? 1 : 
                     index < currentWordIndex ? 0.6 : 0.4,
            scale: index === currentWordIndex ? 1.05 : 1,
            transition: { 
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};