import { Apple } from "lucide-react";

interface ConnectedAccountsProps {
  email: string;
}

export function ConnectedAccounts({ email }: ConnectedAccountsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-medium">Connect accounts</h3>
      <p className="text-lg text-gray-500">You can use these accounts to log in.</p>
      <div className="p-6 bg-gray-50/50 rounded-2xl flex items-center space-x-4">
        <div className="bg-black rounded-xl p-2">
          <Apple className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xl">Apple</div>
          <div className="text-gray-500 text-lg break-all">{email}</div>
        </div>
      </div>
    </div>
  );
}