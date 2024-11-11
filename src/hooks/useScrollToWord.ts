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
    
    // Position the word at 40% from the top of the container
    const topOffset = containerHeight * 0.4;
    const targetScroll = wordPosition - topOffset + (wordHeight / 2);
    
    if (instant) {
      container.scrollTo({ top: targetScroll });
      return;
    }

    const startPosition = container.scrollTop;
    const distance = targetScroll - startPosition;
    const duration = 600; // Slightly longer duration for smoother feel
    const startTime = performance.now();
    
    // Improved easing function for smoother motion
    const easeOutQuint = (t: number): number => {
      return 1 - Math.pow(1 - t, 5);
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = easeOutQuint(progress);
      const currentPosition = startPosition + (distance * eased);
      
      container.scrollTo({
        top: currentPosition,
        behavior: 'auto' // Use auto to prevent conflicts with smooth-scroll
      });
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }, []);
};