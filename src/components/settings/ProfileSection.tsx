import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-4">
      <div className="space-y-6">
        <h3 className="text-2xl font-medium">Personal details</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-600">First name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              className="h-14 rounded-2xl text-lg bg-gray-50 border-gray-100"
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-600">Last name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              className="h-14 rounded-2xl text-lg bg-gray-50 border-gray-100"
              placeholder="Enter your last name"
            />
          </div>
        </div>
      </div>
    </div>
  );
}