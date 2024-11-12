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
    const containerCenter = containerRect.height / 2;
    const wordTop = wordRect.top - containerRect.top;
    const wordCenter = wordRect.height / 2;
    
    // Add vertical offset for better visibility during playback
    const playbackOffset = isPlaying ? -100 : 0;
    
    // Calculate the final scroll position
    const targetScroll = container.scrollTop + (wordTop - containerCenter + wordCenter + playbackOffset);
    
    // Use smooth scrolling behavior
    container.scrollTo({
      top: targetScroll,
      behavior: isPlaying ? 'smooth' : 'auto',
      // Use smooth scrolling during playback, instant for manual clicks
    });
  }, []);
};