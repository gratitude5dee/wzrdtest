import { Button } from "@/components/ui/button";

interface DataManagementProps {
  onClearData: () => void;
}

export function DataManagement({ onClearData }: DataManagementProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Clear local data</h3>
        <p className="text-sm text-gray-500">
          Clear all local data stored on your device. This will affect your app theme.
        </p>
        <Button 
          variant="outline" 
          className="w-full rounded-2xl"
          onClick={onClearData}
        >
          Clear local data
        </Button>
      </div>

      <div className="space-y-4">
        <div className="p-6 bg-red-50 rounded-2xl space-y-2">
          <h3 className="text-lg font-semibold text-red-600">Delete account</h3>
          <p className="text-sm text-gray-600">
            Make a request to permanently delete your Hume AI account and account data. 
            Requests take up to 30 business days to fulfill.
          </p>
        </div>
      </div>
    </div>
  );
}