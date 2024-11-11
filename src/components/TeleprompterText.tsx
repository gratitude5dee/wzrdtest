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
            "teleprompter-line transition-all duration-500 ease-out",
            lineIndex === currentLineIndex && [
              "line-active transform -translate-y-2 scale-[1.02]",
              "relative z-10"
            ],
            lineIndex < currentLineIndex && "line-past opacity-50 translate-y-2",
            lineIndex > currentLineIndex && "line-future opacity-50 -translate-y-2"
          )}
        >
          {line.map((word, wordIndex) => (
            <span
              key={`${lineIndex}-${wordIndex}`}
              ref={lineIndex === currentLineIndex && wordIndex === currentWordIndex ? highlightRef : null}
              onClick={() => handleWordClick(lineIndex, wordIndex)}
              className={cn(
                "inline-block mx-1 px-1 py-0.5 rounded cursor-pointer",
                "transition-all duration-300 ease-out transform",
                "hover:bg-teleprompter-highlight/20",
                lineIndex === currentLineIndex && wordIndex === currentWordIndex && [
                  "word-highlight scale-110",
                  "bg-teleprompter-highlight/10 font-semibold",
                  "shadow-lg shadow-blue-500/20"
                ],
                lineIndex === currentLineIndex && wordIndex < currentWordIndex && "word-past opacity-75",
                (lineIndex === currentLineIndex && wordIndex > currentWordIndex) || 
                lineIndex > currentLineIndex && "word-future opacity-75"
              )}
            >
              {word}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};