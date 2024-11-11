import { useState, useRef, useCallback, useEffect } from 'react';

export const useTeleprompter = (initialSpeed: number = 2) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout>();
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
      containerRef.current.scrollTop = 0;
    }
  }, []);

  const updateScrollPosition = useCallback((wordElement: HTMLElement | null) => {
    if (!wordElement || !containerRef.current) return;
    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    const wordPosition = wordElement.offsetTop;
    const wordHeight = wordElement.offsetHeight;
    const targetScroll = wordPosition - (containerHeight / 2) + (wordHeight / 2);
    
    // Smooth interpolation between current and target scroll position
    const currentScroll = container.scrollTop;
    const distance = targetScroll - currentScroll;
    const smoothness = 0.15; // Lower = smoother
    
    setScrollPosition(prev => prev + (distance * smoothness));
  }, []);

  useEffect(() => {
    if (isPlaying && containerRef.current) {
      const animate = () => {
        setScrollPosition(prev => prev + (speed * 0.5));
        frameRef.current = requestAnimationFrame(animate);
      };
      
      frameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isPlaying, speed]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

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