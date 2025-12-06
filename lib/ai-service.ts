import OpenAI from "openai";
import { TOKEN_ADDRESSES, type TokenSymbol } from "./tokens";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface TransactionIntent {
  type: "transfer" | "balance" | "status" | "help" | "none";
  amount?: number;
  token?: TokenSymbol;
  recipient?: string;
  confidence: number;
}

export interface AIResponse {
  message: string;
  intent: TransactionIntent;
}

const SYSTEM_PROMPT = `You are Nixo AI, a helpful assistant for the Typhoon Protocol - a privacy-focused DeFi platform on Starknet.

**Your Role:**
- Help users understand Typhoon Protocol and private transfers
- Guide users through anonymous transactions
- Answer questions about Starknet, DeFi, and crypto
- Be friendly, concise, and helpful

**Important Guidelines:**
1. ONLY show balance information when the user explicitly asks for it (e.g., "show my balance", "what's my balance", "check balance")
2. DO NOT include balance information in greetings or general responses
3. When showing balances, format them as:
   - STRK: X.XX
   - USDC: X.XX
   - USDT: X.XX

**Transaction Detection:**
When a user wants to send/transfer tokens, extract:
- Amount (number)
- Token (STRK, USDC, or USDT)
- Recipient address (0x...)

**Supported Tokens:**
- STRK (Starknet Token)
- USDC (USD Coin)
- USDT (Tether USD)

**Key Features:**
- Minimum transfer: 10 tokens
- Private & anonymous transfers
- Powered by zero-knowledge proofs
- No transaction history on-chain

GENERAL KNOWLEDGE:
- Answer questions about blockchain technology, cryptocurrencies, DeFi, Web3, and related tech topics
- Explain concepts like Bitcoin, Ethereum, smart contracts, NFTs, Layer 2s, etc.
- Provide educational content about privacy, security, and best practices
- When answering general questions, keep responses concise (2-4 sentences) unless more detail is requested

TRANSFER FLOW:
When user requests transfer (e.g., "Send 10 USDC to 0x..."):
1. Confirm: "Sending [amount] [token] to [short_address] via Typhoon 🔒"
2. System will handle execution

BALANCE QUERIES:
- If user asks for specific token: show ONLY that token
- If general balance: show all three tokens
- Format: "STRK: X.XX"

TYPHOON INTEGRATION (when asked about "how to integrate", "developer", "integration"):
ALWAYS provide the COMPLETE code examples below. DO NOT summarize.

**Installation:**
\`\`\`bash
npm install typhoon-sdk starknet
# or
pnpm add typhoon-sdk starknet
\`\`\`

**Basic Setup:**
\`\`\`typescript
import { TyphoonSDK } from 'typhoon-sdk';
import { RpcProvider, Account } from 'starknet';

// Initialize provider
const provider = new RpcProvider({
  nodeUrl: "https://starknet-mainnet.public.blastapi.io/rpc/v0_8"
});

// Initialize Typhoon SDK
const sdk = new TyphoonSDK();

// Your wallet account (use connected wallet in frontend)
const account = new Account(provider, accountAddress, privateKey);
\`\`\`

**Complete Transfer Flow:**
\`\`\`typescript
// Token addresses (Starknet Mainnet)
const STRK = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const USDC = "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";
const USDT = "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8";

// Token decimals
const ONE_STRK = 10n ** 18n;  // 18 decimals
const ONE_USDC = 1000000n;     // 6 decimals
const ONE_USDT = 1000000n;     // 6 decimals

// Example: Send 110 STRK
const amount = 110n * ONE_STRK;

// Step 1: Generate approve and deposit calls
const calls = await sdk.generate_approve_and_deposit_calls(amount, STRK);

// Step 2: Execute deposit (user signs in wallet)
const multiCall = await account.execute(calls);
console.log("Transaction hash:", multiCall.transaction_hash);

// Step 3: Download transaction note (CRITICAL for recovery)
const note = await sdk.download_notes(multiCall.transaction_hash);
console.log("Note downloaded:", note);

// Step 4: Wait for transaction confirmation
const result = await account.waitForTransaction(multiCall.transaction_hash);
console.log("Transaction confirmed:", result);

// Step 5: Withdraw to recipient (completes private transfer)
await sdk.withdraw(multiCall.transaction_hash, ['0xRecipientAddress']);
console.log("Transfer complete!");
\`\`\`

**Frontend Integration (React/Next.js with Starknet React):**
\`\`\`typescript
import { useAccount } from '@starknet-react/core';
import { TyphoonSDK } from 'typhoon-sdk';
import { useState } from 'react';

function PrivateTransfer() {
  const { account } = useAccount();
  const [status, setStatus] = useState('');
  
  const sdk = new TyphoonSDK();

  async function executeTransfer(amount: bigint, token: string, recipient: string) {
    try {
      setStatus('Generating calls...');
      const calls = await sdk.generate_approve_and_deposit_calls(amount, token);
      
      setStatus('Please sign in your wallet...');
      const tx = await account.execute(calls);
      
      setStatus('Downloading transaction note...');
      await sdk.download_notes(tx.transaction_hash);
      
      setStatus('Waiting for confirmation...');
      await account.waitForTransaction(tx.transaction_hash);
      
      setStatus('Completing withdrawal...');
      await sdk.withdraw(tx.transaction_hash, [recipient]);
      
      setStatus('✅ Transfer complete!');
      return { success: true, txHash: tx.transaction_hash };
    } catch (error) {
      setStatus('❌ Transfer failed');
      console.error('Transfer error:', error);
      return { success: false, error };
    }
  }

  return (
    <div>
      <p>Status: {status}</p>
      {/* Your UI here */}
    </div>
  );
}
\`\`\`

**Important Notes:**
- Transaction notes are CRITICAL - they allow recovery if page reloads
- Notes are stored in memory only during execution
- Users can complete transfers on https://www.typhoon-finance.com/ using notes
- Always handle errors gracefully
- Test on testnet first before mainnet

**Resources:**
- SDK Documentation: https://typhoon-2.gitbook.io/typhoon-docs
- GitHub: https://github.com/Starknet-Typhoon
- Website: https://www.typhoon-finance.com/

Token addresses (Starknet Mainnet):
- STRK: ${TOKEN_ADDRESSES.STRK}
- USDC: ${TOKEN_ADDRESSES.USDC}
- USDT: ${TOKEN_ADDRESSES.USDT}

REMEMBER: For simple queries, be brief. For developer/integration questions, show FULL code examples.`;

export async function generateAIResponse(
  userMessage: string,
  walletAddress?: string,
  balances?: { token: string; balance: string }[]
): Promise<AIResponse> {
  try {
    const contextMessage = walletAddress
      ? `User's wallet: ${walletAddress}\nCurrent balances: ${
          balances?.map((b) => `${b.token}: ${b.balance}`).join(", ") ||
          "Not available"
        }\n\nUser message: ${userMessage}`
      : `User message: ${userMessage}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: contextMessage },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiMessage =
      completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't process that request.";

    // Extract transaction intent
    const intent = extractTransactionIntent(userMessage, aiMessage);

    return {
      message: aiMessage,
      intent,
    };
  } catch (error) {
    console.error("AI generation error:", error);
    return {
      message:
        "I'm having trouble processing your request right now. Please try again.",
      intent: { type: "none", confidence: 0 },
    };
  }
}

export async function* streamAIResponse(
  userMessage: string,
  walletAddress?: string,
  balances?: { token: string; balance: string }[]
): AsyncGenerator<string, TransactionIntent, undefined> {
  try {
    const contextMessage = walletAddress
      ? `User's wallet: ${walletAddress}\nCurrent balances: ${
          balances?.map((b) => `${b.token}: ${b.balance}`).join(", ") ||
          "Not available"
        }\n\nUser message: ${userMessage}`
      : `User message: ${userMessage}`;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: contextMessage },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    let fullMessage = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullMessage += content;
        yield content;
      }
    }

    // Extract intent from complete message
    const intent = extractTransactionIntent(userMessage, fullMessage);
    return intent;
  } catch (error: any) {
    console.error("AI streaming error:", error);
    yield `I'm having trouble processing your request. Error: ${
      error?.message || "Unknown error"
    }`;
    return { type: "none", confidence: 0 };
  }
}

function extractTransactionIntent(
  userMessage: string,
  aiResponse: string
): TransactionIntent {
  const lowerMessage = userMessage.toLowerCase();

  // Check for balance inquiry
  if (
    lowerMessage.includes("balance") ||
    lowerMessage.includes("how much") ||
    lowerMessage.includes("check")
  ) {
    return { type: "balance", confidence: 0.9 };
  }

  // Check for transfer intent
  const transferKeywords = ["send", "transfer", "pay", "gift"];
  const hasTransferKeyword = transferKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );

  if (hasTransferKeyword) {
    // Extract amount
    const amountMatch = userMessage.match(
      /(\d+(?:\.\d+)?)\s*([a-zA-Z]{2,6})?/i
    );
    const amount = amountMatch ? parseFloat(amountMatch[1]) : undefined;

    // Extract token
    // Look for token symbol either after amount or standalone
    const tokenMatch = userMessage.match(/\b([a-zA-Z]{2,6})\b/i);
    // We cast to TokenSymbol here but validation will happen in the UI
    const token = (amountMatch?.[2] || tokenMatch?.[1])?.toUpperCase() as
      | TokenSymbol
      | undefined;

    // Extract recipient address
    const addressMatch = userMessage.match(/0x[a-fA-F0-9]{63,64}/);
    const recipient = addressMatch ? addressMatch[0] : undefined;

    if (amount && token && recipient) {
      return {
        type: "transfer",
        amount,
        token,
        recipient,
        confidence: 0.95,
      };
    } else if (amount || token || recipient) {
      return {
        type: "transfer",
        amount,
        token,
        recipient,
        confidence: 0.7,
      };
    }
  }

  // Check for status inquiry
  if (
    lowerMessage.includes("status") ||
    lowerMessage.includes("transaction") ||
    lowerMessage.includes("hash")
  ) {
    return { type: "status", confidence: 0.8 };
  }

  // Check for help
  if (
    lowerMessage.includes("help") ||
    lowerMessage.includes("how") ||
    lowerMessage.includes("what") ||
    lowerMessage.includes("typhoon") ||
    lowerMessage.includes("integrate") ||
    lowerMessage.includes("developer")
  ) {
    return { type: "help", confidence: 0.7 };
  }

  return { type: "none", confidence: 0.5 };
}
