import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TeleprompterContainerProps {
  children: ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const TeleprompterContainer = ({ children, containerRef }: TeleprompterContainerProps) => {
  return (
    <div
      ref={containerRef}
      className={cn(
        "h-screen overflow-hidden relative z-10 smooth-scroll",
        "px-4 md:px-8 lg:px-16",
        "flex items-center justify-center"
      )}
    >
      {children}
    </div>
  );
};