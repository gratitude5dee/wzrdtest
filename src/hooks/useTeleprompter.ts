import { useState, useRef, useCallback, useEffect } from 'react';

export const useTeleprompter = (initialSpeed: number = 2) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollInterval = useRef<number | null>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);

  const togglePlay = useCallback(() => {
    setIsPlaying((prevState) => !prevState);
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const reset = useCallback(() => {
    if (scrollInterval.current) {
      window.clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
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
    
    const targetScroll = elementPosition - (containerHeight / 2) + (elementHeight / 2);
    
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }, [autoScrollEnabled]);

  useEffect(() => {
    if (isPlaying && containerRef.current && autoScrollEnabled) {
      const scrollAmount = speed * 0.5;
      scrollInterval.current = window.setInterval(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop += scrollAmount;
        }
      }, 16);
    }

    return () => {
      if (scrollInterval.current) {
        window.clearInterval(scrollInterval.current);
        scrollInterval.current = null;
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