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
    
    // Calculate the center position
    const containerCenter = containerRect.top + (containerRect.height / 2);
    const wordOffset = wordRect.top + (wordRect.height / 2);
    const scrollOffset = wordOffset - containerCenter;
    
    // Add current scroll position to maintain relative positioning
    const targetScroll = container.scrollTop + scrollOffset;

    container.scrollTo({
      top: targetScroll,
      behavior: instant ? 'auto' : 'smooth'
    });
  }, []);
};