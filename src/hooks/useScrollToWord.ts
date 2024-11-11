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
    
    const startPosition = container.scrollTop;
    const distance = targetScroll - startPosition;
    
    if (instant) {
      container.scrollTo({ top: targetScroll });
      return;
    }

    // Improved easing function for smoother scroll
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    let startTime: number | null = null;
    const duration = 800; // Longer duration for smoother animation

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = easeOutCubic(progress);
      const currentPosition = startPosition + (distance * eased);
      
      container.scrollTo({
        top: currentPosition,
        behavior: 'auto'
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, []);
};