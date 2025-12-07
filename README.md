NIXO AI

Project Overview 
 
Problem Statement  
In the world of blockchain transactions, maintaining privacy is crucial, yet most transfers are traceable on-chain, exposing users' wallets and activities. Users face complexities in using privacy protocols like Typhoon, including technical barriers, gas fee management, and cumbersome interfaces. Manual processes lead to errors, privacy leaks, and friction, especially for non-technical users who want simple, anonymous transfers without worrying about costs or traceability.  

Solution Summary  
NIXO AI is a conversational DeFi assistant built on Starknet that enables anonymous cryptocurrency transfers using the Typhoon Protocol. Through natural language interactions, users can check balances, initiate private transfers, and manage transactions seamlessly. Integrated with AVNU Paymaster for gasless experiences, it ensures complete anonymity with zero-knowledge proofs, automatic transaction note backups, and support for STRK, USDC, and USDT. Built to make privacy accessible, simple, and fee-free for everyday users.  

Target Audience  

* DeFi Users: Seeking anonymous token transfers without on-chain traceability  
* Privacy-Conscious Individuals: Sending gifts, payments, or deposits while maintaining anonymity  
* Crypto Traders: Depositing to exchanges without linking personal wallets  
* Developers & Builders: Testing privacy protocols in a user-friendly interface and learning how to integrate and use typhoon
* Starknet Ecosystem Participants: Leveraging Layer 2 for fast, private transactions  
* General Crypto Holders: Wanting gasless, AI-driven wallet management  

The Idea  
Inspiration  
Inspired by the growing need for financial privacy in blockchain, where standard transfers leave permanent public records linking wallets and exposing user activities. Existing privacy tools like Typhoon Protocol are powerful but require technical knowledge, complex setups, and gas management. As developers in the Starknet ecosystem, we saw an opportunity to democratize privacy by creating an AI-powered interface that handles everything through simple conversations, eliminating barriers and making anonymous transfers as easy as chatting—while covering gas fees to remove cost friction.  

What it does  
NIXO AI is a decentralized app that facilitates private transfers and wallet management:  

1. Wallet Connection: Users connect Starknet-compatible wallets like ArgentX or Braavos for persistent sessions.  
2. Conversational Interface: Interact via natural language prompts for balance checks, transfers, and status inquiries.
3. Education: Helps developers and starknet users learn about privacy, typhoon and how to integrate typhoon
4. Balance Inquiry: Query and display token balances (STRK, USDC, USDT) in a formatted response.  
5. Transfer Initiation: Parse user commands to validate and prepare anonymous transfers using Typhoon Protocol.  
6. Privacy Processing: Handle approvals, deposits, and withdrawals with zero-knowledge proofs for full anonymity.  
7. Transaction Management: Automatically download notes for backups, monitor status, and provide confirmations or recoveries.  

Perfect for anonymous gifting, private payments, exchange deposits, learning or any scenario requiring untraceable transfers.  

Technical Implementation  
Key Features  
1. Conversational AI Engine: Processes natural language intents for balance inquiries, transfers, and help, with entity extraction for amounts, tokens, and addresses.  
2. Typhoon Protocol Integration: Uses zero-knowledge proofs for anonymous deposits and withdrawals, ensuring no linkage between sender and recipient.  
3. AVNU Paymaster Sponsorship: Covers all gas fees for approvals, deposits, and withdrawals, enabling a truly gasless user experience.  
4. Transaction Note System: Automatically downloads notes for backups, allowing recovery on the Typhoon website if sessions are interrupted.  
5. Validation & Error Handling: Enforces minimum transfers (10 tokens), balance checks, address validation, and clear error messages for issues like insufficient funds or invalid inputs.  
6. State Management: Tracks transaction states from validation to confirmation, with real-time updates and recovery options.  

How we built it  
Tech Stack:  

* Frontend: React with Starknet React for wallet connectivity and UI  
* Blockchain Integration: Typhoon SDK for privacy transactions and Starknet-js for contract interactions  
* AI Processing: Natural language parsing with intent classification and entity extraction logic  
* Paymaster: AVNU integration for gas sponsorship  
* Monitoring: Transaction waiting and confirmation via account.waitForTransaction  

Development Process:  

1. Wallet Integration: Implemented connection flows for ArgentX and Braavos with network checks.  
2. AI Engine Development: Built intent classification for balance, transfer, and status queries.  
3. Typhoon Flow: Integrated SDK for approve/deposit calls, note downloads, and withdrawals.  
4. Paymaster Setup: Configured AVNU sponsorship for all user transactions.  
5. Validation Layers: Added checks for minimums, balances, and formats with templated responses.  
6. Testing: Simulated flows for success, errors, and recoveries, including page reload scenarios.  

API/Services Used  

* Typhoon SDK: For generating privacy transaction calls and note management  
* Starknet-js: Blockchain interactions and multicall executions  
* AVNU Paymaster: Gas fee sponsorship  
* Token ABIs: For balance queries on STRK, USDC, and USDT contracts  

Installation & Setup  
NIXO AI is a web-based DApp—no installation required! Access it at https://nixo-gamma.vercel.app and connect your wallet to get started.  

Usage  
Connect your wallet via the "Connect Wallet" button and approve the request. The AI will greet you: "Welcome! Your wallet is connected. How can I help you today?" Use natural language like "Check my balance" or "Send 50 USDC to 0x...". The AI validates, prepares the Typhoon transaction, requests your signature, downloads a note, and confirms completion. Monitor status in-chat, and recover via Typhoon if needed. Disconnect anytime from the interface.  

Potential Impact  
NIXO AI enhances DeFi privacy, enabling:  

* Secure Anonymous Interactions: Users send without exposure  
* Reduced Privacy Risks: Prevents wallet tracking and profiling  
* Increased Adoption: Simplifies Typhoon for broader audiences  
* Financial Privacy in Markets: Empowers users in regions with surveillance concerns  
* Innovation in DeFi: Encourages more private collaborations and transactions  

Live Demo  

* Live URL: https://nixo-gamma.vercel.app
* Video Demo: http://drive.google.com/file/d/1swrHAqwlkhoG2pek7KPgUcyZp0HC8iPT/view
