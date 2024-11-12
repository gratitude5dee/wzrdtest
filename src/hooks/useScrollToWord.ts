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
    
    // Calculate the center position, accounting for the word's height
    const containerCenter = containerRect.height / 2;
    const wordCenter = wordRect.height / 2;
    const scrollOffset = wordElement.offsetTop - containerCenter + wordCenter;
    
    container.scrollTo({
      top: scrollOffset,
      behavior: instant ? 'auto' : 'smooth'
    });
  }, []);
};