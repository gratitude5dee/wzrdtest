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
      // Add a small delay to ensure proper initial positioning
      setTimeout(() => {
        scrollToWord(firstWordRef.current, containerRef.current, true);
        initialScrollComplete.current = true;
      }, 100);
    }
  }, [containerRef, firstWordRef, scrollToWord]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 overflow-y-auto overflow-x-hidden smooth-scroll",
        "px-4 md:px-8 lg:px-16"
      )}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div className="min-h-[200vh] w-full">
        <div className="sticky top-[40vh] left-0 right-0 transform-gpu">
          {children}
        </div>
      </div>
    </div>
  );
};