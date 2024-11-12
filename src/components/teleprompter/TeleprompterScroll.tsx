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
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (highlightRef.current && containerRef.current) {
      // Clear any existing scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Add a small delay for smooth transitions during playback
      const scrollDelay = isPlaying ? 100 : 0;
      
      scrollTimeoutRef.current = setTimeout(() => {
        scrollToWord(highlightRef.current!, containerRef.current!, isPlaying);
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