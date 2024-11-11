import { useCallback } from 'react';

export const useScrollToWord = () => {
  return useCallback((
    wordElement: HTMLElement | null,
    container: HTMLElement | null,
    instant: boolean = false
  ) => {
    if (!wordElement || !container) return;
    
    const containerHeight = container.clientHeight;
    const wordPosition = wordElement.offsetTop;
    const wordHeight = wordElement.offsetHeight;
    
    // Position the word at 20% from the top of the container
    const topOffset = containerHeight * 0.2;
    const targetScroll = wordPosition - topOffset;
    
    // Use spring-like easing for smooth animation
    const startPosition = container.scrollTop;
    const distance = targetScroll - startPosition;
    const duration = instant ? 0 : 800; // ms
    
    if (instant) {
      container.scrollTo({ top: targetScroll, behavior: 'instant' });
      return;
    }

    const startTime = performance.now();
    
    // Custom easing function for smooth, spring-like motion
    const easeOutSpring = (t: number): number => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0
        ? 0
        : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = easeOutSpring(progress);
      const currentPosition = startPosition + distance * eased;
      
      container.scrollTo({ top: currentPosition, behavior: 'instant' });
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }, []);
};