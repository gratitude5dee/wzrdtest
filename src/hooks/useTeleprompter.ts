import { useState, useRef, useCallback, useEffect } from 'react';

export const useTeleprompter = (initialSpeed: number = 2, autoStart: boolean = false) => {
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [speed, setSpeed] = useState(initialSpeed);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }
  }, []);

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
    
    const startPosition = container.scrollTop;
    const distance = targetScroll - startPosition;
    const duration = 800; // ms
    const startTime = performance.now();
    
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
      
      container.scrollTop = currentPosition;
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
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
