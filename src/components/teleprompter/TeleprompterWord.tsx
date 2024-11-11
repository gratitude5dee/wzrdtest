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
  textColor,
}: TeleprompterWordProps) => {
  return (
    <span
      key={index}
      ref={index === currentWordIndex ? highlightRef : null}
      onClick={() => onClick(index)}
      className={cn(
        "inline-block mx-1 px-1 py-0.5 rounded transition-all duration-300 cursor-pointer hover:bg-teleprompter-highlight/20",
        index === currentWordIndex
          ? "text-teleprompter-highlight scale-110 bg-teleprompter-highlight/10 font-semibold"
          : index < currentWordIndex
          ? `opacity-60`
          : `opacity-40`
      )}
      style={{
        color: index === currentWordIndex ? '#3B82F6' : undefined
      }}
    >
      {word}
    </span>
  );
};