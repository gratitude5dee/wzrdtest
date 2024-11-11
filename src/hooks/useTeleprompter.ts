import { useState, useRef, useCallback, useEffect } from 'react';

export const useTeleprompter = (initialSpeed: number = 2) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setScrollPosition(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  const updateScrollPosition = useCallback((wordElement: HTMLElement | null) => {
    if (!wordElement || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    const wordPosition = wordElement.offsetTop;
    const wordHeight = wordElement.offsetHeight;
    const targetScroll = wordPosition - (containerHeight / 2) + (wordHeight / 2);
    
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
    
    setScrollPosition(targetScroll);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    if (isPlaying && containerRef.current) {
      const animate = () => {
        setScrollPosition(prev => {
          const newPosition = prev + (speed * 0.5);
          if (containerRef.current) {
            containerRef.current.scrollTo({
              top: newPosition,
              behavior: 'auto'
            });
          }
          return newPosition;
        });
        animationFrameId = requestAnimationFrame(animate);
      };
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, speed]);

  return {
    isPlaying,
    speed,
    containerRef,
    togglePlay,
    updateSpeed,
    reset,
    updateScrollPosition,
  };
};