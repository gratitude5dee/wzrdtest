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
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (highlightRef.current && containerRef.current) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime.current;
      
      // Immediate scroll during playback for better sync
      const scrollDelay = isPlaying ? 0 : Math.max(0, 100 - timeSinceLastScroll);
      
      scrollTimeoutRef.current = setTimeout(() => {
        scrollToWord(highlightRef.current!, containerRef.current!, isPlaying);
        lastScrollTime.current = Date.now();
      }, scrollDelay);
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentWordIndex, scrollToWord, isPlaying]);

  return null;
};