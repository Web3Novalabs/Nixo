import { getQuotes, executeSwap, type Quote } from "@avnu/avnu-sdk";
import type { AccountInterface } from "starknet";
import { TOKEN_ADDRESSES } from "./tokens";

export interface SwapParams {
  sellToken: "ETH" | "STRK";
  buyToken: "ETH" | "STRK";
  sellAmount: number; // in token units (e.g., 0.1 ETH)
  takerAddress: string;
}

export interface SwapQuote {
  sellAmount: bigint;
  buyAmount: bigint;
  sellToken: string;
  buyToken: string;
  rate: number;
  rawQuote: Quote;
}

/**
 * Fetch swap quote from AVNU
 */
export async function fetchSwapQuote(
  params: SwapParams
): Promise<SwapQuote | null> {
  try {
    const { sellToken, buyToken, sellAmount, takerAddress } = params;

    // Convert to wei (18 decimals for both ETH and STRK)
    const amountInWei = BigInt(Math.floor(sellAmount * 1e18));

    const quotes = await getQuotes({
      sellTokenAddress: TOKEN_ADDRESSES[sellToken],
      buyTokenAddress: TOKEN_ADDRESSES[buyToken],
      sellAmount: amountInWei,
      takerAddress,
    });

    if (!quotes || quotes.length === 0) {
      return null;
    }

    const bestQuote = quotes[0];
    const rate = Number(bestQuote.buyAmount) / Number(bestQuote.sellAmount);

    return {
      sellAmount: bestQuote.sellAmount,
      buyAmount: bestQuote.buyAmount,
      sellToken: TOKEN_ADDRESSES[sellToken],
      buyToken: TOKEN_ADDRESSES[buyToken],
      rate,
      rawQuote: bestQuote,
    };
  } catch (error) {
    console.error("[AVNU] Failed to fetch quote:", error);
    return null;
  }
}

/**
 * Execute swap transaction
 */
export async function executeSwapTransaction(
  account: AccountInterface,
  quote: Quote,
  slippage: number = 0.01 // 1% default slippage
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    console.log("[AVNU] Executing swap...");

    const result = await executeSwap({
      provider: account,
      quote,
      slippage,
    });

    console.log("[AVNU] Swap executed:", result);

    return {
      success: true,
      txHash: result.transactionHash,
    };
  } catch (error: any) {
    console.error("[AVNU] Swap execution failed:", error);

    // Check for user rejection
    if (
      error?.message?.includes("rejected") ||
      error?.message?.includes("User abort")
    ) {
      return {
        success: false,
        error: "Transaction rejected by user",
      };
    }

    return {
      success: false,
      error: error?.message || "Swap failed",
    };
  }
}

/**
 * Format token amount from wei to readable format
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number = 18
): string {
  return (Number(amount) / Math.pow(10, decimals)).toFixed(4);
}

/**
 * Calculate exchange rate
 */
export function calculateRate(sellAmount: bigint, buyAmount: bigint): number {
  return Number(buyAmount) / Number(sellAmount);
}
