import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TeleprompterWordProps {
  word: string;
  index: number;
  currentWordIndex: number;
  onClick: (index: number) => void;
  highlightRef: React.RefObject<HTMLSpanElement> | null;
  textColor?: string;
}

export const TeleprompterWord = ({
  word,
  index,
  currentWordIndex,
  onClick,
  highlightRef,
  textColor = "#785340",
}: TeleprompterWordProps) => {
  return (
    <motion.span
      key={index}
      ref={highlightRef}
      onClick={() => onClick(index)}
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
      style={{
        color: index === currentWordIndex ? textColor : undefined,
        textShadow: index === currentWordIndex ? 
          `0 0 20px ${textColor}40, 0 0 40px ${textColor}20, 0 0 60px ${textColor}10` : undefined
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
            background: `${textColor}10`
          }}
        />
      )}
    </motion.span>
  );
};