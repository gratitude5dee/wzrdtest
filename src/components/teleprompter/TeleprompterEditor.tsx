import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TeleprompterEditorProps {
  editableScript: string;
  setEditableScript: (script: string) => void;
  fontFamily: string;
  fontSize: number;
  textColor: string;
}

export const TeleprompterEditor = ({
  editableScript,
  setEditableScript,
  fontFamily,
  fontSize,
  textColor,
}: TeleprompterEditorProps) => {
  return (
    <motion.div
      key="editor"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-5xl mx-auto h-[70vh] px-4"
    >
      <Textarea
        value={editableScript}
        onChange={(e) => setEditableScript(e.target.value)}
        className={cn(
          "w-full h-full bg-transparent border-none resize-none p-8 focus:ring-0 teleprompter-text",
          "placeholder:text-white/40"
        )}
        style={{
          fontFamily: fontFamily === 'inter' ? 'Inter' : 
                     fontFamily === 'cal-sans' ? 'Cal Sans' : fontFamily,
          fontSize: `${fontSize / 16}rem`,
          color: textColor,
        }}
      />
    </motion.div>
  );
};