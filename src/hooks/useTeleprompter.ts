import { useState, useRef, useCallback, useEffect } from 'react';

export const useTeleprompter = (initialSpeed: number = 2) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const isMountedRef = useRef(true);

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
    }
    setIsPlaying(false);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    lastTimeRef.current = 0;
  }, []);

  const updateScrollPosition = useCallback((element: HTMLElement | null) => {
    if (!element || !containerRef.current || !isMountedRef.current) return;
    
    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    const elementPosition = element.offsetTop;
    const elementHeight = element.offsetHeight;
    
    const targetScroll = elementPosition - (containerHeight / 2) + (elementHeight / 2);
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!isMountedRef.current) return;
      
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      
      const deltaTime = timestamp - lastTimeRef.current;
      
      if (containerRef.current && isPlaying) {
        const pixelsPerSecond = speed * 40;
        const scrollAmount = (pixelsPerSecond * deltaTime) / 1000;
        containerRef.current.scrollTop += scrollAmount;
      }
      
      lastTimeRef.current = timestamp;
      
      if (isPlaying && isMountedRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, speed]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isPlaying,
    speed,
    containerRef,
    togglePlay,
    updateSpeed,
    reset,
    updateScrollPosition
  };
};