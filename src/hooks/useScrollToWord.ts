import { useCallback } from 'react';

export const useScrollToWord = () => {
  return useCallback((
    wordElement: HTMLElement,
    container: HTMLElement,
    instant: boolean = false
  ) => {
    if (!wordElement || !container) return;
    
    const containerHeight = container.clientHeight;
    const wordPosition = wordElement.offsetTop;
    const wordHeight = wordElement.offsetHeight;
    
    // Position the word at 40% from the top of the container for better visibility
    const topOffset = containerHeight * 0.4;
    const targetScroll = wordPosition - topOffset + (wordHeight / 2);

    if (instant) {
      container.scrollTo({ top: targetScroll });
      return;
    }

    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }, []);
};