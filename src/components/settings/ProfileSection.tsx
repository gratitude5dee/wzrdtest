import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface ProfileSectionProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

export function ProfileSection({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}: ProfileSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">Personal details</h3>
        <p className="text-gray-500">Update your personal information.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <Label 
            htmlFor="firstName" 
            className="text-base font-medium text-gray-700"
          >
            First name
          </Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="h-14 text-lg rounded-2xl border-gray-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            placeholder="Enter your first name"
          />
        </div>
        
        <div className="space-y-4">
          <Label 
            htmlFor="lastName" 
            className="text-base font-medium text-gray-700"
          >
            Last name
          </Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            className="h-14 text-lg rounded-2xl border-gray-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            placeholder="Enter your last name"
          />
        </div>
      </div>
    </motion.div>
  );
}