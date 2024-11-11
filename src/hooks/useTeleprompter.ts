import { useState, useRef, useCallback } from 'react';
import { useScrollToWord } from './useScrollToWord';
import type { TeleprompterHookReturn } from '@/types/teleprompter';

export const useTeleprompter = (
  initialSpeed: number = 2,
  autoStart: boolean = false
): TeleprompterHookReturn => {
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [speed, setSpeed] = useState(initialSpeed);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollToWord = useScrollToWord();

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const updateScrollPosition = useCallback((element: HTMLElement) => {
    if (containerRef.current) {
      scrollToWord(element, containerRef.current);
    }
  }, [scrollToWord]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setSpeed(initialSpeed);
  }, [initialSpeed]);

  return {
    isPlaying,
    speed,
    togglePlay,
    updateSpeed,
    reset,
    containerRef,
    updateScrollPosition,
  };
};