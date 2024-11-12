import { useEffect } from 'react';
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

  useEffect(() => {
    if (highlightRef.current && containerRef.current) {
      // Always scroll immediately when the word changes
      scrollToWord(highlightRef.current, containerRef.current, isPlaying);
    }
  }, [currentWordIndex, scrollToWord, isPlaying]);

  return null;
};