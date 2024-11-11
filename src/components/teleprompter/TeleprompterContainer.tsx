import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useRef } from "react";
import { useScrollToWord } from "@/hooks/useScrollToWord";

interface TeleprompterContainerProps {
  children: ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
  firstWordRef?: React.RefObject<HTMLElement>;
  autoStart?: boolean;
}

export const TeleprompterContainer = ({ 
  children, 
  containerRef,
  firstWordRef,
  autoStart = false
}: TeleprompterContainerProps) => {
  const initialScrollComplete = useRef(false);
  const scrollToWord = useScrollToWord();

  useEffect(() => {
    if (!initialScrollComplete.current && containerRef.current && firstWordRef?.current) {
      // Scroll to first word on mount
      scrollToWord(firstWordRef.current, containerRef.current, true);
      initialScrollComplete.current = true;
    }
  }, [containerRef, firstWordRef, scrollToWord]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-screen overflow-hidden relative z-10",
        "px-4 md:px-8 lg:px-16",
        "flex items-center justify-center"
      )}
    >
      <div className="max-w-4xl w-full py-24">
        {children}
      </div>
    </div>
  );
};