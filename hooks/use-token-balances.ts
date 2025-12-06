import { useBalance } from "@starknet-react/core";
import { useAccount } from "@starknet-react/core";
import { TOKEN_ADDRESSES, type TokenSymbol } from "@/lib/tokens";

interface TokenBalance {
  token: TokenSymbol;
  balance: string;
  loading: boolean;
  error: string | null;
}

export function useTokenBalances() {
  const { address } = useAccount();

  // Fetch STRK balance
  const {
    data: strkData,
    isLoading: strkLoading,
    error: strkError,
  } = useBalance({
    address,
    token: TOKEN_ADDRESSES.STRK,
    watch: true,
  });

  // Fetch USDC balance
  const {
    data: usdcData,
    isLoading: usdcLoading,
    error: usdcError,
  } = useBalance({
    address,
    token: TOKEN_ADDRESSES.USDC,
    watch: true,
  });

  // Fetch USDT balance
  const {
    data: usdtData,
    isLoading: usdtLoading,
    error: usdtError,
  } = useBalance({
    address,
    token: TOKEN_ADDRESSES.USDT,
    watch: true,
  });

  const balances: TokenBalance[] = [
    {
      token: "STRK",
      balance: strkData?.formatted || "0.00",
      loading: strkLoading,
      error: strkError ? strkError.message : null,
    },
    {
      token: "USDC",
      balance: usdcData?.formatted || "0.00",
      loading: usdcLoading,
      error: usdcError ? usdcError.message : null,
    },
    {
      token: "USDT",
      balance: usdtData?.formatted || "0.00",
      loading: usdtLoading,
      error: usdtError ? usdtError.message : null,
    },
  ];

  const isLoading = strkLoading || usdcLoading || usdtLoading;

  return { balances, isLoading };
}
