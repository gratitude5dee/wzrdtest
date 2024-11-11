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
    <div className="space-y-6">
      <h3 className="text-[28px] font-medium text-[#2A2A2A]">Personal details</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-[#6B7280] text-base">First name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="h-[72px] rounded-[32px] text-[28px] bg-white border-[#E5E7EB] px-6"
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-[#6B7280] text-base">Last name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            className="h-[72px] rounded-[32px] text-[28px] bg-white border-[#E5E7EB] px-6"
            placeholder="Enter your last name"
          />
        </div>
      </div>
    </div>
  );
}