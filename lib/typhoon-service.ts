import { TyphoonSDK } from "typhoon-sdk";
import { RpcProvider, AccountInterface } from "starknet";
import { TOKEN_ADDRESSES, TOKEN_DECIMALS, type TokenSymbol } from "./tokens";

export interface TransferParams {
  amount: number;
  token: TokenSymbol;
  recipient: string;
}

export type TransferStatus =
  | "generating"
  | "signing"
  | "downloading"
  | "confirming"
  | "withdrawing"
  | "success"
  | "error";

export class TyphoonService {
  private sdk: TyphoonSDK;
  private provider: RpcProvider;

  constructor() {
    this.sdk = new TyphoonSDK();
    this.provider = new RpcProvider({
      nodeUrl:
        process.env.NEXT_PUBLIC_STARKNET_RPC_URL ||
        "https://starknet-mainnet.public.blastapi.io/rpc/v0_8",
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
    onStatusChange?: (status: TransferStatus, message: string) => void,
    onChatMessage?: (message: string) => void
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const { amount, token, recipient } = params;

      // Get token address and decimals
      const tokenAddress = TOKEN_ADDRESSES[token];
      const decimals = TOKEN_DECIMALS[token];

      // Convert amount to BigInt with proper decimals
      const amountBigInt = BigInt(Math.floor(amount * 10 ** decimals));

      // Step 1: Generate approve and deposit calls
      const generatingMsg = "Generating transaction calls...";
      onStatusChange?.("generating", generatingMsg);
      onChatMessage?.(`⏳ ${generatingMsg}`);

      console.log("[Typhoon] Starting generate_approve_and_deposit_calls", {
        amount: amountBigInt.toString(),
        tokenAddress,
      });

      const calls = await this.sdk.generate_approve_and_deposit_calls(
        amountBigInt,
        tokenAddress
      );

      console.log("[Typhoon] Generated calls:", calls.length, "calls");

      // Step 2: Execute deposit (user signs in wallet)
      const signingMsg = "Please sign the transaction in your wallet...";
      onStatusChange?.("signing", signingMsg);
      onChatMessage?.(`✍️ ${signingMsg}`);

      console.log(
        "[Typhoon] Requesting wallet signature for",
        calls.length,
        "calls"
      );

      const multiCall = await account.execute(calls);
      const txHash = multiCall.transaction_hash;

      console.log("[Typhoon] Transaction signed, hash:", txHash);

      // Step 3: Download transaction note
      const downloadingMsg = "Downloading transaction note for recovery...";
      onStatusChange?.("downloading", downloadingMsg);
      onChatMessage?.(`📥 ${downloadingMsg}`);

      await this.sdk.download_notes(txHash);

      // Step 4: Wait for confirmation
      const confirmingMsg = "Waiting for transaction confirmation...";
      onStatusChange?.("confirming", confirmingMsg);
      onChatMessage?.(`⏱️ ${confirmingMsg}`);

      await account.waitForTransaction(txHash);

      // Step 5: Withdraw to recipient
      const withdrawingMsg = "Completing anonymous withdrawal to recipient...";
      onStatusChange?.("withdrawing", withdrawingMsg);
      onChatMessage?.(`🔒 ${withdrawingMsg}`);

      await this.sdk.withdraw(txHash, [recipient]);

      const successMsg = "Transfer completed successfully! 🎉";
      onStatusChange?.("success", successMsg);
      onChatMessage?.(`✅ ${successMsg}`);

      return {
        success: true,
        txHash,
      };
    } catch (error: unknown) {
      console.error("Typhoon transfer error:", error);

      // Check if user rejected the transaction
      const errorObj = error as { message?: string; code?: string };
      const isUserRejection =
        errorObj?.message?.includes("USER_REFUSED_OP") ||
        errorObj?.message?.includes("User rejected") ||
        errorObj?.message?.includes("User denied") ||
        errorObj?.message?.includes("rejected") ||
        errorObj?.code === "ACTION_REJECTED";

      let errorMessage: string;
      if (isUserRejection) {
        errorMessage =
          "Transaction cancelled - you rejected the signature request.";
        onChatMessage?.(
          `❌ **Transfer cancelled**\n\nYou rejected the transaction signature. No funds were transferred.`
        );
      } else {
        errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        onChatMessage?.(
          `❌ **Transfer failed**\n\nAn error occurred: ${errorMessage}`
        );
      }

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
  validateTransfer(
    params: TransferParams,
    balance: number
  ): {
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
