import { useState, useRef, useCallback, useEffect } from 'react';

export const useTeleprompter = (initialSpeed: number = 2) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const mountedRef = useRef<boolean>(true);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
    lastTimeRef.current = 0;
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    setIsPlaying(false);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    lastTimeRef.current = 0;
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
    mountedRef.current = true;
    
    const animate = (timestamp: number) => {
      if (!mountedRef.current) return;
      
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      
      const deltaTime = timestamp - lastTimeRef.current;
      
      if (containerRef.current && isPlaying && autoScrollEnabled) {
        const pixelsPerSecond = speed * 30; // Adjusted for smoother scrolling
        const scrollAmount = (pixelsPerSecond * deltaTime) / 1000;
        containerRef.current.scrollTop += scrollAmount;
      }
      
      lastTimeRef.current = timestamp;
      
      if (mountedRef.current && isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      mountedRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
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