# NIXO AI — Your Conversational Privacy Assistant on Starknet

## Project Overview

### Problem Statement
In the world of blockchain transactions, maintaining privacy is crucial, yet most transfers are traceable on-chain, exposing users' wallets and activities. Powerful privacy protocols like **Typhoon** exist, but they come with technical barriers, complex setups, gas fee management, and unfriendly interfaces. Manual processes often lead to errors, privacy leaks, and friction — especially for non-technical users who simply want to send money anonymously without worrying about costs or traceability.

### Solution Summary
**NIXO AI** is a conversational DeFi assistant built on Starknet that makes anonymous cryptocurrency transfers as easy as chatting.

Powered by the **Typhoon Protocol** for zero-knowledge privacy and integrated with **AVNU** for seamless token swapping (so you never need to hold STRK for gas), NIXO handles everything through natural language:

- Check balances
- Send private transfers
- Swap tokens if needed
- Manage transactions
- Automatically backup your privacy notes

All with **complete on-chain anonymity**, **zero gas fees for the user**, and a beautiful chat interface.

Supported tokens: **STRK • USDC • USDT**

## Target Audience
- DeFi users seeking truly anonymous token transfers
- Privacy-conscious individuals (anonymous gifts, payments, donations)
- Traders depositing to exchanges without linking their main wallet
- Developers & builders learning or integrating Typhoon Protocol
- Starknet ecosystem participants who want fast, private L2 transactions
- Everyday crypto holders who want a gasless, AI-powered privacy wallet

## The Idea

### Inspiration
Standard blockchain transfers leave permanent public records that link wallets forever. While Typhoon Protocol solves privacy at the protocol level, using it directly is technically demanding. As Starknet developers, we wanted to **democratize financial privacy** by building an AI layer that hides all complexity — turning “private transfer” into “just talk to the bot”.

### What it does
1. **Wallet Connection** – Connect Argent X or Braavos (persistent session)
2. **Conversational Interface** – Talk naturally: “Send 100 USDC to 0x123…”, “What’s my balance?”, “Swap 50 STRK to USDC and send privately”
3. **Privacy-Preserving Transfers** – Full Typhoon Protocol flow (approve → deposit → withdraw) with zero-knowledge proofs
4. **Seamless Swapping via AVNU** – Automatically swap any supported token to the required token if needed (no need to hold STRK or pay gas yourself)
5. **Automatic Note Backup** – Downloads your Typhoon notes instantly for recovery
6. **Education & Developer Mode** – Explains privacy concepts, shows the exact Typhoon calls under the hood, and teaches developers how to integrate Typhoon into their own dApps

Perfect for anonymous gifting, private payments, exchange deposits, testing privacy flows, or learning how zero-knowledge privacy works on Starknet.

## Technical Implementation

### Key Features
1. **Conversational AI Engine** – Intent classification + entity extraction (amounts, tokens, addresses)
2. **Typhoon Protocol Integration** – Full ZK-shielded deposits & withdrawals
3. **AVNU Swap Integration** – Automatic token swaps when user doesn’t hold the destination token (e.g. pay with STRK → receive USDC privately)
4. **Zero Gas Fees for Users** – All transactions sponsored or swapped via AVNU
5. **Transaction Note System** – Auto-download notes for backup/recovery on typhoon.cash
6. **Robust Validation** – Min 10 tokens, balance checks, address format, clear error messages
7. **Developer Education Layer** – On-demand explanations of Typhoon flows, view raw calls, copy integration code snippets

### Tech Stack
- **Frontend**: React + Starknet React + Tailwind
- **Blockchain**: Starknet.js + Typhoon SDK + multicall
- **Swaps & Sponsorship**: AVNU SDK
- **AI/NLP**: Custom intent classification & entity parsing
- **Token Balances**: Direct contract calls (STRK, USDC, USDT ABIs)

### Development Process
1. Wallet & network integration (Argent X / Braavos)
2. Intent engine for balance, transfer, swap, status, and help queries
3. Full Typhoon flow with note downloading
4. AVNU swap integration for token conversion
5. Validation layers + user-friendly error templates
6. Extensive testing (success, failures, page reload recovery)

## Installation & Setup
No installation needed!  
Live web dApp: https://nixo-gamma.vercel.app

Just visit the site, click “Connect Wallet”, and start chatting.

## Usage Example
```
You: Check my balance
NIXO: Your balances:
   • STRK: 12.5
   • USDC: 245.80
   • USDT: 1,020.00You: Send 50 USDC privately to 0xabc123...
NIXO: Preparing private transfer via Typhoon...
       → Swapping if needed (via AVNU)
       → Requesting signature (1/3 approve)
       → Depositing to shield pool...
       → Note saved! Backup downloaded.
       → Withdrawal prepared for recipient
       Transfer complete! Fully private
```

## Developer & Education Features
NIXO doubles as a learning tool:
- Type “Explain this transaction” to see the exact Typhoon calls
- Ask “How do I integrate Typhoon in my dApp?” → get ready-to-use code snippets
- Learn about ZK proofs, note format, recovery process, and best practices

## Potential Impact
- True financial privacy for everyday users
- Massive simplification of Typhoon Protocol adoption
- Gasless + swap-enabled experience removes all friction
- Educational bridge for developers entering privacy tech
- Strengthens Starknet as the privacy layer of Ethereum L2s

## Live Demo
- **Web App**: https://nixo-gamma.vercel.app
- **Demo Video**: https://drive.google.com/file/d/1swrHAqwlkhoG2pek7KPgUcyZp0HC8iPT/view
