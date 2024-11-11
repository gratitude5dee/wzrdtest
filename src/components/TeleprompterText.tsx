import { cn } from "@/lib/utils";
import { RefObject } from "react";

interface TeleprompterTextProps {
  lines: string[][];
  currentLineIndex: number;
  currentWordIndex: number;
  highlightRef: RefObject<HTMLSpanElement>;
  handleWordClick: (lineIndex: number, wordIndex: number) => void;
  fontSize: number;
  fontFamily: string;
  textColor: string;
}

export const TeleprompterText = ({
  lines,
  currentLineIndex,
  currentWordIndex,
  highlightRef,
  handleWordClick,
  fontSize,
  fontFamily,
  textColor
}: TeleprompterTextProps) => {
  return (
    <div 
      className="teleprompter-text"
      style={{
        fontFamily: fontFamily === 'inter' ? 'Inter' : 
                   fontFamily === 'cal-sans' ? 'Cal Sans' : fontFamily,
        fontSize: `${fontSize / 16}rem`,
        color: textColor,
      }}
    >
      {lines.map((line, lineIndex) => {
        const isCurrentLine = lineIndex === currentLineIndex;
        const isPastLine = lineIndex < currentLineIndex;
        const isFutureLine = lineIndex > currentLineIndex;
        
        return (
          <div
            key={lineIndex}
            className={cn(
              "teleprompter-line",
              isCurrentLine && "line-active",
              isPastLine && "line-past",
              isFutureLine && "line-future"
            )}
          >
            {line.map((word, wordIndex) => {
              const isCurrentWord = isCurrentLine && wordIndex === currentWordIndex;
              const isPastWord = (isCurrentLine && wordIndex < currentWordIndex) || isPastLine;
              const isFutureWord = (isCurrentLine && wordIndex > currentWordIndex) || isFutureLine;
              
              return (
                <span
                  key={`${lineIndex}-${wordIndex}`}
                  ref={isCurrentWord ? highlightRef : null}
                  onClick={() => handleWordClick(lineIndex, wordIndex)}
                  className={cn(
                    "inline-block transition-all duration-300 cursor-pointer",
                    "hover:bg-teleprompter-highlight/20",
                    isCurrentWord && "word-highlight",
                    isPastWord && "word-past",
                    isFutureWord && "word-future"
                  )}
                >
                  {word}{" "}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};