import { motion } from "framer-motion";

interface ConnectedAccountsProps {
  email: string;
}

export function ConnectedAccounts({ email }: ConnectedAccountsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">Connected accounts</h3>
        <p className="text-gray-500">Manage your connected accounts and sign-in methods.</p>
      </div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center space-x-6">
          <div className="bg-black rounded-2xl p-3">
            <img src="/apple-logo.svg" alt="Apple" className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-semibold text-gray-900">Apple</div>
            <div className="text-gray-500 text-lg truncate">{email}</div>
          </div>
          <div className="flex-shrink-0">
            <div className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-600">
              Connected
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}