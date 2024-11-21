import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AffirmationsDisplayProps {
  words: string[];
  currentWordIndex: number;
  highlightRef: React.RefObject<HTMLSpanElement>;
  firstWordRef: React.RefRef<HTMLSpanElement>;
  handleWordClick: (index: number) => void;
}

export const AffirmationsDisplay = ({
  words,
  currentWordIndex,
  highlightRef,
  firstWordRef,
  handleWordClick
}: AffirmationsDisplayProps) => {
  return (
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
  );
};