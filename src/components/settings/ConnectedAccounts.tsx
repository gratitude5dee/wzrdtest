interface ConnectedAccountsProps {
  email: string;
}

export function ConnectedAccounts({ email }: ConnectedAccountsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[28px] font-medium text-[#2A2A2A]">Connect accounts</h3>
      <p className="text-[#6B7280] text-lg">You can use these accounts to log in.</p>
      <div className="bg-[#F9FAFB] rounded-[32px] p-6 flex items-center space-x-4">
        <div className="bg-black rounded-xl p-2">
          <img src="/apple-logo.svg" alt="Apple" className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="text-[28px] font-medium text-[#2A2A2A]">Apple</div>
          <div className="text-[#6B7280] text-lg break-all">{email}</div>
        </div>
      </div>
    </div>
  );
}