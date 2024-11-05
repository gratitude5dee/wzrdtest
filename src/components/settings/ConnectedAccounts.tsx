import { Apple } from "lucide-react";

interface ConnectedAccountsProps {
  email: string;
}

export function ConnectedAccounts({ email }: ConnectedAccountsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Connect accounts</h3>
      <p className="text-sm text-gray-500">You can use these accounts to log in.</p>
      <div className="p-4 bg-gray-50 rounded-2xl flex items-center">
        <Apple className="h-6 w-6 mr-3" />
        <div>
          <div>Apple</div>
          <div className="text-sm text-gray-500">{email}</div>
        </div>
      </div>
    </div>
  );
}