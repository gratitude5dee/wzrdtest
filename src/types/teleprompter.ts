export interface TeleprompterHookReturn {
  isPlaying: boolean;
  speed: number;
  togglePlay: () => void;
  updateSpeed: (newSpeed: number) => void;
  reset: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}