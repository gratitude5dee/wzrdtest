import { useCallback } from 'react';

export const useScrollToWord = () => {
  return useCallback((
    wordElement: HTMLElement,
    container: HTMLElement,
    isPlaying: boolean = false
  ) => {
    if (!wordElement || !container) return;
    
    const containerRect = container.getBoundingClientRect();
    const wordRect = wordElement.getBoundingClientRect();
    
    // Calculate the target scroll position to keep the word in view
    const targetScroll = wordElement.offsetTop - (container.clientHeight / 3);
    
    container.scrollTo({
      top: targetScroll,
      behavior: isPlaying ? 'auto' : 'smooth'
    });
  }, []);
};
