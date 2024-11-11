import { cn } from "@/lib/utils";
import { ReactNode, useEffect } from "react";

interface TeleprompterContainerProps {
  children: ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const TeleprompterContainer = ({ children, containerRef }: TeleprompterContainerProps) => {
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-screen overflow-hidden relative z-10",
        "px-4 md:px-8 lg:px-16",
        "flex items-center justify-center"
      )}
    >
      <div className="max-w-4xl w-full py-24">
        {children}
      </div>
    </div>
  );
};