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
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          ref={index === currentWordIndex ? highlightRef : null}
          onClick={() => handleWordClick(index)}
          className={cn(
            "inline-block mx-1 px-1 py-0.5 rounded cursor-pointer transition-all duration-300",
            "hover:bg-white/10 backdrop-blur-sm",
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
                     index < currentWordIndex ? 0.6 : 0.4,
            transition: { duration: 0.3 }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};