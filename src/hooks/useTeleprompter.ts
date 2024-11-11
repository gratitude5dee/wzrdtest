import { useState, useRef, useCallback, useEffect } from 'react';
import { useScrollToWord } from './useScrollToWord';

export const useTeleprompter = (initialSpeed: number = 2, autoStart: boolean = false) => {
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [speed, setSpeed] = useState(initialSpeed);
  const scrollToWord = useScrollToWord();
  
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    isPlaying,
    speed,
    togglePlay,
    updateSpeed,
    reset,
  };
};