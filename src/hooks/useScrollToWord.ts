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
    
    // Position the word at 40% from the top of the container for better visibility
    const topOffset = containerHeight * 0.4;
    const targetScroll = wordPosition - topOffset;
    
    const startPosition = container.scrollTop;
    const distance = targetScroll - startPosition;
    const duration = instant ? 0 : 500;
    
    if (instant) {
      container.scrollTo({ top: targetScroll });
      return;
    }

    const startTime = performance.now();
    
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = easeOutCubic(progress);
      const currentPosition = startPosition + (distance * eased);
      
      container.scrollTo({ top: currentPosition });
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }, []);
};