import { useState, useRef, useCallback, useEffect } from 'react';

export const useTeleprompter = (initialSpeed: number = 2) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout>();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  const updateScrollPosition = useCallback((element: HTMLElement | null) => {
    if (!element || !containerRef.current || !autoScrollEnabled) return;
    
    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    const elementPosition = element.offsetTop;
    const elementHeight = element.offsetHeight;
    
    // Calculate the target scroll position to center the element
    const targetScroll = elementPosition - (containerHeight / 2) + (elementHeight / 2);
    
    // Smooth scroll to the target position
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }, [autoScrollEnabled]);

  // Handle auto-scrolling when playing
  useEffect(() => {
    if (isPlaying && containerRef.current && autoScrollEnabled) {
      const scrollAmount = speed * 0.5; // Adjust this value to control scroll speed
      scrollInterval.current = setInterval(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop += scrollAmount;
        }
      }, 16); // ~60fps
    }

    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [isPlaying, speed, autoScrollEnabled]);

  return {
    isPlaying,
    speed,
    containerRef,
    togglePlay,
    updateSpeed,
    reset,
    updateScrollPosition,
    setAutoScrollEnabled
  };
};