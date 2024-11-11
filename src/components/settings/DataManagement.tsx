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
      className="space-y-8"
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">Clear local data</h3>
          <p className="text-gray-500">
            Clear all local data stored on your device. This action cannot be undone.
          </p>
        </div>
        
        <Button 
          variant="outline" 
          className="h-14 px-8 rounded-2xl text-lg font-medium border-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
          onClick={onClearData}
        >
          <Trash2 className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          Clear local data
        </Button>
      </div>

      <motion.div 
        className="p-8 bg-red-50 rounded-3xl space-y-4 border border-red-100"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <h3 className="text-2xl font-semibold text-gray-900">Delete account</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Make a request to permanently delete your account and all associated data. 
          This process takes up to 30 business days and cannot be undone.
        </p>
        <Button 
          variant="destructive"
          className="mt-4 h-14 px-8 rounded-2xl text-lg font-medium hover:bg-red-600 transition-all duration-200"
        >
          Request Account Deletion
        </Button>
      </motion.div>
    </motion.div>
  );
}