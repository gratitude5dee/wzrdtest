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
      // Position first word at the top with a small offset
      const container = containerRef.current;
      const word = firstWordRef.current;
      const topOffset = container.clientHeight * 0.2; // 20% from the top
      const targetScroll = word.offsetTop - topOffset;
      
      container.scrollTo({
        top: targetScroll,
        behavior: 'instant'
      });
      
      initialScrollComplete.current = true;
    }
  }, [containerRef, firstWordRef]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-screen overflow-hidden relative z-10",
        "px-4 md:px-8 lg:px-16"
      )}
    >
      <div className="max-w-4xl w-full mx-auto py-[40vh]">
        {children}
      </div>
    </div>
  );
};