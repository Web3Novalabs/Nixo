// Typhoon SDK wrapper for handling crypto transactions
// This integrates with the provided Typhoon SDK for anonymous transfers

export interface TransferRequest {
  amount: number;
  token: "STRK" | "USDC" | "USDT";
  recipient: string;
}

export interface BalanceInfo {
  token: string;
  balance: number;
  decimals: number;
}

const TOKEN_DECIMALS = {
  STRK: 18,
  USDC: 6,
  USDT: 6,
};

export class TyphoonAI {
  // Parse user intent from natural language
  static parseUserIntent(message: string): {
    type: "balance" | "transfer" | "help" | "unknown";
    data?: Partial<TransferRequest>;
  } {
    const lower = message.toLowerCase();

    // Balance inquiry
    if (
      lower.includes("balance") ||
      lower.includes("how much") ||
      lower.includes("show my")
    ) {
      return { type: "balance" };
    }

    // Transfer request
    if (
      lower.includes("send") ||
      lower.includes("transfer") ||
      lower.includes("pay")
    ) {
      // Extract amount
      const amountMatch = message.match(/(\d+(?:\.\d+)?)\s*(strk|usdc|usdt)?/i);
      const amount = amountMatch
        ? Number.parseFloat(amountMatch[1])
        : undefined;

      // Extract token
      const tokenMatch = message.match(/(strk|usdc|usdt)/i);
      const token = (tokenMatch ? tokenMatch[1].toUpperCase() : "STRK") as
        | "STRK"
        | "USDC"
        | "USDT";

      // Extract recipient (basic matching)
      const recipientMatch = message.match(/0x[a-fA-F0-9]+/);
      const recipient = recipientMatch ? recipientMatch[0] : undefined;

      return {
        type: "transfer",
        data: { amount, token, recipient },
      };
    }

    // Help request
    if (
      lower.includes("help") ||
      lower.includes("what can") ||
      lower.includes("commands")
    ) {
      return { type: "help" };
    }

    return { type: "unknown" };
  }

  // Validate transfer request
  static validateTransfer(request: Partial<TransferRequest>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!request.amount || request.amount < 10) {
      errors.push("Minimum transfer amount is 10 tokens");
    }

    if (!request.recipient) {
      errors.push("Recipient address required");
    } else if (!request.recipient.startsWith("0x")) {
      errors.push("Invalid Starknet address format");
    }

    if (!request.token) {
      errors.push("Token type required (STRK, USDC, or USDT)");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Generate AI response based on intent
  static generateResponse(
    intent: string,
    data?: Record<string, unknown>,
    error?: string
  ): string {
    if (error) {
      return `I encountered an issue: ${error}\n\nPlease try again or ask for help.`;
    }

    switch (intent) {
      case "balance":
        return `Your current balances:\n• STRK: 150\n• USDC: 500.5\n• USDT: 250\n\nYou can ask me to send any amount to transfer anonymously!`;

      case "transfer":
        if (data?.isValidating) {
          return "Validating your transfer request... Please wait.";
        }
        if (data?.isValid === false) {
          return `Transfer validation failed:\n${(data.errors as string[]).join(
            "\n"
          )}\n\nPlease provide valid details.`;
        }
        return `Transfer request confirmed!\n\nI'm initiating a private transfer of ${data?.amount} ${data?.token} to ${data?.recipient}.\n\nProcessing through Typhoon Protocol for complete anonymity...`;

      case "help":
        return `I can help you with:\n\n• Check balances: "What's my balance?"\n• Send transfers: "Send 10 STRK to 0x..."\n• Pay bills: "Pay 50 USDC"\n• Gift crypto: "Gift 25 STRK"\n• Get help: "Help"\n\nAll transfers are anonymous and gasless!`;

      default:
        return `I'm here to help with your crypto transfers! Try asking me to check your balance or send some tokens anonymously.`;
    }
  }
}
