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
      {lines.map((line, lineIndex) => (
        <div
          key={lineIndex}
          className={cn(
            "teleprompter-line",
            lineIndex === currentLineIndex && "line-active",
            lineIndex < currentLineIndex && "line-past",
            lineIndex > currentLineIndex && "line-future"
          )}
        >
          {line.map((word, wordIndex) => {
            const isCurrentWord = lineIndex === currentLineIndex && wordIndex === currentWordIndex;
            const isPastWord = (lineIndex === currentLineIndex && wordIndex < currentWordIndex) || 
                             lineIndex < currentLineIndex;
            const isFutureWord = (lineIndex === currentLineIndex && wordIndex > currentWordIndex) || 
                               lineIndex > currentLineIndex;
            
            return (
              <span
                key={`${lineIndex}-${wordIndex}`}
                ref={isCurrentWord ? highlightRef : null}
                onClick={() => handleWordClick(lineIndex, wordIndex)}
                className={cn(
                  "inline-block mx-1 px-2 py-1 rounded-md transition-all duration-300",
                  "cursor-pointer hover:bg-teleprompter-highlight/20",
                  isCurrentWord && "word-highlight",
                  isPastWord && "word-past",
                  isFutureWord && "word-future"
                )}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};