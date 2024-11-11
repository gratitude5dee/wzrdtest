import { useEffect } from 'react';
import { useScrollToWord } from '@/hooks/useScrollToWord';

interface TeleprompterScrollProps {
  highlightRef: React.RefObject<HTMLElement>;
  containerRef: React.RefObject<HTMLElement>;
  currentWordIndex: number;
}

export const TeleprompterScroll = ({
  highlightRef,
  containerRef,
  currentWordIndex,
}: TeleprompterScrollProps) => {
  const scrollToWord = useScrollToWord();

  useEffect(() => {
    if (highlightRef.current && containerRef.current) {
      scrollToWord(highlightRef.current, containerRef.current);
    }
  }, [currentWordIndex, scrollToWord, highlightRef, containerRef]);

  return null;
};