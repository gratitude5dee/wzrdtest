import { Button } from "@/components/ui/button";

interface DataManagementProps {
  onClearData: () => void;
}

export function DataManagement({ onClearData }: DataManagementProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[28px] font-medium text-[#2A2A2A]">Clear local data</h3>
        <p className="text-[#6B7280] text-lg">
          Clear all local data stored on your device. This will affect your app theme.
        </p>
        <Button 
          variant="outline" 
          className="h-14 px-8 rounded-full text-lg bg-[#2A2A2A] text-white hover:bg-[#2A2A2A]/90"
          onClick={onClearData}
        >
          Clear local data
        </Button>
      </div>

      <div className="p-8 bg-[#FEF2F2] rounded-[32px] space-y-3">
        <h3 className="text-[28px] font-medium text-[#2A2A2A]">Delete account</h3>
        <p className="text-[#6B7280] text-lg">
          Make a request to permanently delete your Hume AI account and account data. 
          Requests take up to 30 business days to fulfill.
        </p>
      </div>
    </div>
  );
}