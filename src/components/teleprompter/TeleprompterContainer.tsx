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
    // Ensure initial scroll happens after content is fully rendered
    const timer = setTimeout(() => {
      if (!initialScrollComplete.current && containerRef.current && firstWordRef?.current) {
        scrollToWord(firstWordRef.current, containerRef.current, autoStart);
        initialScrollComplete.current = true;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [containerRef, firstWordRef, scrollToWord, autoStart]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 overflow-y-auto overflow-x-hidden scroll-smooth",
        "px-4 md:px-8 lg:px-16"
      )}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div className="min-h-[200vh] w-full">
        <div className="py-[50vh] flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};