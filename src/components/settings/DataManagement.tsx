import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DataManagementProps {
  onClearData: () => void;
}

export function DataManagement({ onClearData }: DataManagementProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold text-gray-900">Clear local data</h3>
          <p className="text-sm text-gray-500">
            Clear all local data stored on your device. This action cannot be undone.
          </p>
        </div>
        
        <Button 
          variant="outline" 
          className="h-10 px-4 rounded-lg text-sm font-medium border hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
          onClick={onClearData}
        >
          <Trash2 className="mr-2 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          Clear local data
        </Button>
      </div>

      <motion.div 
        className="p-4 bg-red-50 rounded-xl space-y-3 border border-red-100"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h3 className="text-base font-semibold text-gray-900">Delete account</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Make a request to permanently delete your account and all associated data. 
          This process takes up to 30 business days and cannot be undone.
        </p>
        <Button 
          variant="destructive"
          className="mt-2 h-9 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-200"
        >
          Request Account Deletion
        </Button>
      </motion.div>
    </motion.div>
  );
}