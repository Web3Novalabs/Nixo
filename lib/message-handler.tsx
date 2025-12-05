import { TyphoonAI } from "./typhoon";

export interface MessageContext {
  walletAddress?: string;
  isConnected: boolean;
}

export async function handleUserMessage(
  message: string,
  context: MessageContext
): Promise<string> {
  // Parse user intent
  const intent = TyphoonAI.parseUserIntent(message);

  // Check wallet connection for sensitive operations
  if (
    (intent.type === "transfer" || intent.type === "balance") &&
    !context.isConnected
  ) {
    return "Please connect your wallet first to perform transactions.";
  }

  // Handle different intents
  switch (intent.type) {
    case "balance":
      return TyphoonAI.generateResponse("balance");

    case "transfer": {
      // Validate transfer request
      const validation = TyphoonAI.validateTransfer(intent.data || {});

      if (!validation.valid) {
        return TyphoonAI.generateResponse("transfer", {
          isValid: false,
          errors: validation.errors,
        });
      }

      // Here you would integrate with actual Typhoon SDK
      // For now, we return a processing message
      return TyphoonAI.generateResponse("transfer", {
        ...intent.data,
        isValid: true,
      });
    }

    case "help":
      return TyphoonAI.generateResponse("help");

    default:
      return TyphoonAI.generateResponse("unknown");
  }
}
