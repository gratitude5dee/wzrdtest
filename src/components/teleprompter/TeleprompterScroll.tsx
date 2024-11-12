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
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // During playback, scroll immediately
      if (isPlaying) {
        scrollToWord(highlightRef.current, containerRef.current, true);
      } else {
        // When not playing, add a small delay for smoother manual navigation
        scrollTimeoutRef.current = setTimeout(() => {
          scrollToWord(highlightRef.current!, containerRef.current!, false);
        }, 50);
      }
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentWordIndex, scrollToWord, isPlaying]);

  return null;
};