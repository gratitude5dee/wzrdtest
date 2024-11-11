import { useLocation, useNavigate } from 'react-router-dom';
import { useTeleprompter } from '@/hooks/useTeleprompter';
import { TeleprompterControls } from '@/components/TeleprompterControls';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface TeleprompterState {
  script: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
}

export const Teleprompter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const { script, fontSize, fontFamily, textColor } = (location.state as TeleprompterState) || {};
  const parentRef = useRef<HTMLDivElement>(null);
  
  const {
    isPlaying,
    speed,
    containerRef,
    togglePlay,
    updateSpeed,
    reset,
    updateScrollPosition
  } = useTeleprompter(2);

  const rowVirtualizer = useVirtualizer({
    count: words.length,
    getScrollElement: () => containerRef.current,
    estimateSize: useCallback(() => fontSize * 1.5, [fontSize]),
    overscan: 20,
  });

  useEffect(() => {
    if (!script) {
      navigate('/');
      return;
    }
    setWords(script.split(/\s+/).filter(word => word.length > 0));
  }, [script, navigate]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= words.length - 1) {
            clearInterval(interval);
            togglePlay();
            return prev;
          }
          return prev + 1;
        });
      }, 60000 / (speed * 200));
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, speed, words.length, togglePlay]);

  useEffect(() => {
    if (containerRef.current) {
      const virtualItem = rowVirtualizer.getVirtualItems().find(
        virtualItem => virtualItem.index === currentWordIndex
      );
      
      if (virtualItem) {
        containerRef.current.scrollTop = virtualItem.start - containerRef.current.clientHeight / 2;
      }
    }
  }, [currentWordIndex, rowVirtualizer]);

  const handleExit = useCallback(() => {
    reset();
    setCurrentWordIndex(0);
    navigate('/');
  }, [reset, navigate]);

  const handleWordClick = useCallback((index: number) => {
    setCurrentWordIndex(index);
  }, []);

  return (
    <div className="min-h-screen bg-teleprompter-bg overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      
      <div
        ref={containerRef}
        className="h-screen overflow-hidden relative z-10 smooth-scroll"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px)`,
            }}
            className="teleprompter-text"
          >
            {rowVirtualizer.getVirtualItems().map(virtualItem => (
              <span
                key={virtualItem.key}
                data-index={virtualItem.index}
                onClick={() => handleWordClick(virtualItem.index)}
                className={`inline-block mx-1 px-1 py-0.5 rounded transition-all duration-300 cursor-pointer hover:bg-teleprompter-highlight/20 ${
                  virtualItem.index === currentWordIndex
                    ? 'text-teleprompter-highlight scale-110 bg-teleprompter-highlight/10 font-semibold animate-highlight'
                    : virtualItem.index < currentWordIndex
                    ? `${textColor}/60`
                    : `${textColor}/40`
                }`}
                style={{
                  fontFamily: fontFamily === 'inter' ? 'Inter' : 
                           fontFamily === 'cal-sans' ? 'Cal Sans' : fontFamily,
                  fontSize: `${fontSize / 16}rem`,
                  color: virtualItem.index === currentWordIndex ? '#3B82F6' : undefined,
                }}
              >
                {words[virtualItem.index]}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-teleprompter-bg via-teleprompter-bg/80 to-transparent pointer-events-none z-20" />
      <div className="fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-teleprompter-bg via-teleprompter-bg/80 to-transparent pointer-events-none z-20" />
      
      <TeleprompterControls
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={togglePlay}
        onSpeedChange={updateSpeed}
        onExit={handleExit}
      />
    </div>
  );
};