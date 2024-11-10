import { useState, useEffect, useCallback, useRef } from 'react';

export const useTeleprompter = (initialSpeed: number = 2) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWordPositionRef = useRef<number>(0);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setScrollPosition(0);
    lastWordPositionRef.current = 0;
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
    lastWordPositionRef.current = targetScroll;
    setScrollPosition(targetScroll);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = scrollPosition;
  }, [scrollPosition]);

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