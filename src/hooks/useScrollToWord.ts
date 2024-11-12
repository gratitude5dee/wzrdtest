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
    
    // Calculate the target scroll position to center the word
    const targetScroll = (
      container.scrollTop + 
      (wordRect.top - containerRect.top) - 
      (containerRect.height / 2) + 
      (wordRect.height / 2)
    );
    
    container.scrollTo({
      top: targetScroll,
      behavior: isPlaying ? 'auto' : 'smooth'
    });
  }, []);
};