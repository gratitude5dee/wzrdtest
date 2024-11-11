import { Button } from "@/components/ui/button";

interface DataManagementProps {
  onClearData: () => void;
}

export function DataManagement({ onClearData }: DataManagementProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-medium">Clear local data</h3>
        <p className="text-lg text-gray-500">
          Clear all local data stored on your device. This will affect your app theme.
        </p>
        <Button 
          variant="outline" 
          className="h-14 px-8 rounded-full text-lg bg-black text-white hover:bg-black/90"
          onClick={onClearData}
        >
          Clear local data
        </Button>
      </div>

      <div className="p-8 bg-red-50 rounded-3xl space-y-3">
        <h3 className="text-2xl font-medium text-red-600">Delete account</h3>
        <p className="text-lg text-gray-600">
          Make a request to permanently delete your Hume AI account and account data. 
          Requests take up to 30 business days to fulfill.
        </p>
      </div>
    </div>
  );
}