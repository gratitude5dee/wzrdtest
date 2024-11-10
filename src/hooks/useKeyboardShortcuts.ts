import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useKeyboardShortcuts = (
  onSpeedChange: (speed: number) => void,
  onTogglePlay: () => void,
  currentSpeed: number
) => {
  const handleSpeedChange = useCallback((newSpeed: number) => {
    const clampedSpeed = Math.min(Math.max(0.1, newSpeed), 10);
    onSpeedChange(clampedSpeed);
    toast.success(`Speed: ${clampedSpeed.toFixed(1)}x`);
  }, [onSpeedChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Prevent key repeat

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onTogglePlay();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleSpeedChange(currentSpeed + 0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleSpeedChange(currentSpeed - 0.1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, handleSpeedChange, currentSpeed]);
};