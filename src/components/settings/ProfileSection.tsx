import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileSectionProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

export function ProfileSection({ firstName, lastName, onFirstNameChange, onLastNameChange }: ProfileSectionProps) {
  return (
    <div className="space-y-6 bg-white dark:bg-slate-900 rounded-3xl p-8">
      <h3 className="text-2xl font-display">Personal details</h3>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-500 dark:text-gray-400 text-lg">First name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="h-16 rounded-2xl text-xl bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700"
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-500 dark:text-gray-400 text-lg">Last name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            className="h-16 rounded-2xl text-xl bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700"
            placeholder="Enter your last name"
          />
        </div>
      </div>
    </div>
  );
}