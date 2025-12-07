import Image from "next/image";

interface BalanceCardProps {
  balances: { token: string; balance: string }[];
}

export default function BalanceCard({ balances }: BalanceCardProps) {
  const getTokenColor = (token: string) => {
    switch (token) {
      case "STRK":
        return "from-purple-500 to-pink-500";
      case "USDC":
        return "from-blue-500 to-cyan-500";
      case "USDT":
        return "from-green-500 to-emerald-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const getTokenIcon = (token: string) => {
    switch (token) {
      case "STRK":
        return "/strkImg.png";
      case "USDC":
        return "/usdcImg.png";
      case "USDT":
        return "/usdtImg.png";
      case "ETH":
        return "/ethImg.png";
      default:
        return "/strkImg.png";
    }
  };

  const totalValue = balances.reduce(
    (acc, bal) =>
      acc + parseFloat(bal.balance) * (bal.token === "STRK" ? 2.5 : 1),
    0
  );

  return (
    <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-purple-500/30 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="text-lg">💰</span>
          Your Wallet Balances
        </h3>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>

      <div className="space-y-3">
        {balances.map((bal, index) => {
          const icon = getTokenIcon(bal.token);
          const isEmoji = icon.length === 2; // Emoji check

          return (
            <div
              key={bal.token}
              className="group relative overflow-hidden rounded-lg bg-slate-900/40 border border-purple-500/20 hover:border-purple-500/40 p-3 transition-all duration-300 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTokenColor(
                      bal.token
                    )} flex items-center justify-center shadow-lg`}
                  >
                    {isEmoji ? (
                      <span className="text-xl">{icon}</span>
                    ) : (
                      <Image
                        src={icon}
                        alt={bal.token}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {bal.token}
                    </div>
                    <div className="text-xs text-slate-400">Available</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-white font-mono">
                    {parseFloat(bal.balance).toFixed(
                      bal.token === "ETH" ? 4 : 2
                    )}
                  </div>
                  <div className="text-xs text-purple-400 font-medium">
                    $
                    {(
                      parseFloat(bal.balance) * (bal.token === "STRK" ? 1 : 1)
                    ).toFixed(bal.token === "ETH" ? 4 : 2)}
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
