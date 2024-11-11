import { useEffect, useRef } from 'react';
import { useScrollToWord } from '@/hooks/useScrollToWord';

interface TeleprompterScrollProps {
  highlightRef: React.RefObject<HTMLElement>;
  containerRef: React.RefObject<HTMLElement>;
  currentWordIndex: number;
  isPlaying: boolean;
}

export const TeleprompterScroll = ({
  highlightRef,
  containerRef,
  currentWordIndex,
  isPlaying,
}: TeleprompterScrollProps) => {
  const scrollToWord = useScrollToWord();
  const lastScrollTime = useRef<number>(0);

  useEffect(() => {
    if (highlightRef.current && containerRef.current) {
      const now = Date.now();
      // Add a small delay between scrolls to ensure smooth animation
      const shouldAnimate = now - lastScrollTime.current > 100;
      
      if (shouldAnimate) {
        scrollToWord(highlightRef.current, containerRef.current, !isPlaying);
        lastScrollTime.current = now;
      }
    }
  }, [currentWordIndex, scrollToWord, isPlaying]);

  return null;
};