import { useCallback } from 'react';

export const useScrollToWord = () => {
  return useCallback((
    wordElement: HTMLElement,
    container: HTMLElement,
    instant: boolean = false
  ) => {
    if (!wordElement || !container) return;
    
    const containerRect = container.getBoundingClientRect();
    const wordRect = wordElement.getBoundingClientRect();
    
    // Calculate the scroll position to center the word
    const scrollTop = container.scrollTop;
    const containerCenter = containerRect.height / 2;
    const wordTop = wordRect.top - containerRect.top;
    const wordCenter = wordRect.height / 2;
    
    // Calculate the target scroll position
    const targetScroll = scrollTop + (wordTop - containerCenter + wordCenter);
    
    container.scrollTo({
      top: targetScroll,
      behavior: instant ? 'auto' : 'smooth'
    });
  }, []);
};