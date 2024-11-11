import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useRef } from "react";

interface TeleprompterContainerProps {
  children: ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
  currentWordIndex: number;
  words: string[];
  autoStart?: boolean;
}

export const TeleprompterContainer = ({ 
  children, 
  containerRef,
  currentWordIndex,
  words,
  autoStart = false
}: TeleprompterContainerProps) => {
  const lastScrolledIndex = useRef(currentWordIndex);

  useEffect(() => {
    if (containerRef.current && currentWordIndex !== lastScrolledIndex.current) {
      const wordElements = containerRef.current.getElementsByClassName('word-container');
      if (wordElements[currentWordIndex]) {
        const wordElement = wordElements[currentWordIndex] as HTMLElement;
        const containerHeight = containerRef.current.clientHeight;
        const wordPosition = wordElement.offsetTop;
        const wordHeight = wordElement.offsetHeight;
        
        const targetScroll = wordPosition - (containerHeight * 0.4) + (wordHeight / 2);
        
        containerRef.current.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
        
        lastScrolledIndex.current = currentWordIndex;
      }
    }
  }, [currentWordIndex, containerRef]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 overflow-y-auto overflow-x-hidden",
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