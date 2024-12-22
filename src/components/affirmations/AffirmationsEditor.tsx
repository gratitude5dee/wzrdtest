import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

interface AffirmationsEditorProps {
  editableScript: string;
  setEditableScript: (script: string) => void;
}

export const AffirmationsEditor = ({ editableScript, setEditableScript }: AffirmationsEditorProps) => {
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
        className="w-full h-full bg-transparent border-none resize-none p-8 focus:ring-0 text-[2.75rem] leading-relaxed"
        style={{
          fontFamily: 'Cal Sans',
          color: '#785340',
        }}
      />
    </motion.div>
  );
};