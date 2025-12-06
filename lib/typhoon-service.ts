import { TyphoonSDK } from "typhoon-sdk";
import { Account, RpcProvider, AccountInterface } from "starknet";
import { TOKEN_ADDRESSES, TOKEN_DECIMALS, type TokenSymbol } from "./tokens";

export interface TransferParams {
  amount: number;
  token: TokenSymbol;
  recipient: string;
}

export type TransferStatus = "generating" | "signing" | "downloading" | "confirming" | "withdrawing" | "success" | "error";

export class TyphoonService {
  private sdk: TyphoonSDK;
  private provider: RpcProvider;

  constructor() {
    this.sdk = new TyphoonSDK();
    this.provider = new RpcProvider({
      nodeUrl: process.env.NEXT_PUBLIC_STARKNET_RPC_URL || "https://starknet-mainnet.public.blastapi.io/rpc/v0_8",
    });
  }

  /**
   * Execute a private transfer using Typhoon Protocol
   */
  async executeTransfer(
    account: AccountInterface,
    params: {
      amount: number;
      token: TokenSymbol;
      recipient: string;
    },
    onStatusChange?: (status: TransferStatus, message: string) => void
  ): Promise<{ success: boolean; txHash?: string; error?: any }> {
    try {
      const { amount, token, recipient } = params;

      // Get token address and decimals
      const tokenAddress = TOKEN_ADDRESSES[token];
      const decimals = TOKEN_DECIMALS[token];

      // Convert amount to BigInt with proper decimals
      const amountBigInt = BigInt(Math.floor(amount * 10 ** decimals));

      // Step 1: Generate approve and deposit calls
      onStatusChange?.("generating", "Generating transaction calls...");
      const calls = await this.sdk.generate_approve_and_deposit_calls(
        amountBigInt,
        tokenAddress
      );

      // Step 2: Execute deposit (user signs in wallet)
      onStatusChange?.(
        "signing",
        "Please sign the transaction in your wallet..."
      );
      const multiCall = await account.execute(calls);
      const txHash = multiCall.transaction_hash;

      // Step 3: Download transaction note
      onStatusChange?.(
        "downloading",
        "Downloading transaction note for recovery..."
      );
      await this.sdk.download_notes(txHash);

      // Step 4: Wait for confirmation
      onStatusChange?.(
        "confirming",
        "Waiting for transaction confirmation..."
      );
      await account.waitForTransaction(txHash);

      // Step 5: Withdraw to recipient
      onStatusChange?.(
        "withdrawing",
        "Completing anonymous withdrawal to recipient..."
      );
      await this.sdk.withdraw(txHash, [recipient]);

      onStatusChange?.("success", "Transfer completed successfully! 🎉");

      return {
        success: true,
        txHash,
      };
    } catch (error) {
      console.error("Typhoon transfer error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      onStatusChange?.("error", `Transfer failed: ${errorMessage}`);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Validate transfer parameters
   */
  validateTransfer(params: TransferParams, balance: number): {
    valid: boolean;
    error?: string;
  } {
    const { amount, token, recipient } = params;

    // Check minimum amount
    if (amount < 10) {
      return {
        valid: false,
        error: `Minimum transfer amount is 10 ${token}`,
      };
    }

    // Check balance
    if (amount > balance) {
      return {
        valid: false,
        error: `Insufficient ${token} balance. You have ${balance} ${token}`,
      };
    }

    // Validate recipient address
    if (!recipient.match(/^0x[a-fA-F0-9]{63,64}$/)) {
      return {
        valid: false,
        error: "Invalid Starknet address format",
      };
    }

    return { valid: true };
  }
}

// Singleton instance
export const typhoonService = new TyphoonService();
