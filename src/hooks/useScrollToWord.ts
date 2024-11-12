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
    
    const scrollTop = container.scrollTop;
    const containerCenter = containerRect.height / 2;
    const wordTop = wordRect.top - containerRect.top;
    const wordCenter = wordRect.height / 2;
    
    // Calculate the target scroll position with a slight offset during playback
    const targetScroll = scrollTop + (wordTop - containerCenter + wordCenter);
    
    container.scrollTo({
      top: targetScroll,
      behavior: isPlaying ? 'auto' : 'smooth'
    });
  }, []);
};