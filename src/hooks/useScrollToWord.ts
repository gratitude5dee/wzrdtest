import { useCallback } from 'react';

export const useScrollToWord = () => {
  const scrollToWord = useCallback((
    wordElement: HTMLElement | null,
    container: HTMLElement | null,
    instant: boolean = false
  ) => {
    if (!wordElement || !container) return;
    
    const containerHeight = container.clientHeight;
    const wordPosition = wordElement.offsetTop;
    const wordHeight = wordElement.offsetHeight;
    
    // Calculate position to center the word vertically
    const targetScroll = wordPosition - (containerHeight / 2) + (wordHeight / 2);
    
    container.scrollTo({
      top: targetScroll,
      behavior: instant ? 'instant' : 'smooth'
    });
  }, []);

  return scrollToWord;
};