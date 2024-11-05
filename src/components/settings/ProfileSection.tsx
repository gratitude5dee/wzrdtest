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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal details</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="rounded-2xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            className="rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}