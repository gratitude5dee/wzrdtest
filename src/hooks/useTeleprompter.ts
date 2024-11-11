import { useState, useRef, useCallback } from 'react';
import type { TeleprompterHookReturn } from '@/types/teleprompter';

export const useTeleprompter = (
  initialSpeed: number = 2,
  autoStart: boolean = false
): TeleprompterHookReturn => {
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [speed, setSpeed] = useState(initialSpeed);
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

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
  };
};