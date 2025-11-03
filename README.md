PayLink — Universal Web3 Payment Gateway (Polygon Testnet)

Overview

PayLink lets anyone accept crypto payments, subscriptions, or donations on Polygon (testnet). It generates a unique payment link for each user (e.g., /u/nikku) and processes transactions via smart contracts. Includes dashboard, QR generator, optional NFT receipts, and developer API.

Monorepo Structure

- contracts: Solidity contracts + Hardhat for deployment on Polygon Amoy
- backend: Node.js/Express API, MongoDB, Ethers.js listeners
- frontend: React app (Vite) with Wallet integration and UI

Quick Start

1) Prerequisites
- Node 18+
- pnpm or npm
- MongoDB Atlas URI
- Alchemy/Infura Polygon Amoy RPC URL
- A funded Polygon Amoy wallet (for deploying contracts)
- Pinata/IPFS token (optional for NFT receipts)

2) Environment Setup

Create the following files from the provided examples:

- contracts/.env
  - PRIVATE_KEY=
  - POLYGON_AMOY_RPC_URL=

- backend/.env
  - PORT=4000
  - MONGODB_URI=
  - RPC_URL=
  - CONTRACT_ADDRESS=
  - RECEIPT_NFT_ADDRESS=
  - WALLET_PRIVATE_KEY=
  - PINATA_JWT= (optional, for NFT metadata upload)
  - JWT_SECRET=change_me

- frontend/.env
  - VITE_BACKEND_URL=http://localhost:4000
  - VITE_CONTRACT_ADDRESS=
  - VITE_RECEIPT_NFT_ADDRESS=
  - VITE_RPC_URL=

3) Install Dependencies

In each folder (contracts, backend, frontend):

pnpm install

4) Deploy Contracts (Polygon Amoy)

cd contracts
pnpm hardhat compile
pnpm hardhat run scripts/deploy.ts --network amoy

Copy the printed addresses into backend/.env and frontend/.env.

5) Start Services

Backend:

cd backend
pnpm dev

Frontend:

cd frontend
pnpm dev

Open the URL from Vite output.

One Command Dev (Backend + Frontend)

At the repo root:

npm install
npm run dev

This runs backend (port 4000) and frontend (Vite) together using concurrently. Ensure your backend/.env and frontend/.env are set first.

How It Works (System)

1) Registration & Link
- User signs up with email and connects wallet.
- Backend stores user profile and generates a unique slug (e.g., nikku).

2) Payments
- Visitors open /pay/:slug
- Choose token (MATIC/USDC), enter amount, click Pay
- Frontend calls contract via wallet; contract logs event and forwards/holds funds

3) Dashboard
- Backend listens to contract events via Ethers, writes MongoDB records
- Frontend fetches payments and shows analytics

4) NFT Receipts (optional)
- After payment, backend can mint an NFT receipt (IPFS metadata)

Smart Contracts

- PaymentGateway.sol
  - Accepts native MATIC and ERC20 tokens (allowlist)
  - Records Payment events (payer, receiver, token, amount, tx hash, timestamp, memo)
  - Supports direct forward to receiver or escrow-withdraw model (configurable per payment)

- ReceiptNFT.sol
  - Minimal ERC721 for payment receipt NFTs
  - Mint-by-backend (owner-only) with tokenURI on IPFS

Backend (Node/Express)

- Auth: simple email-based signup + JWT; wallet address linked
- Users: create/get profile, payment link slug
- Payments: list user payments, generate QR data, webhook-like event indexing
- NFT: optional endpoint to mint receipt NFTs
- Ethers listener: subscribes to Payment events, stores in MongoDB

Frontend (React/Vite)

- Landing: value prop + CTA
- Dashboard: wallet connect, copy payment link, recent payments, QR generator
- Payment Page: enter amount, select token, Pay Now via MetaMask/WalletConnect
- Post-payment: success screen with PolygonScan link; optional NFT receipt link

APIs (Backend)

Base URL: /api

- POST /api/auth/signup { email, walletAddress, name }
  - returns { token, user }
- GET /api/users/me (auth)
- POST /api/users/link (auth) { desiredSlug }
- GET /api/payments/:slug
- POST /api/nft/receipt (auth) { paymentId }

Contracts (ABIs)

ABIs are built under contracts/artifacts; the frontend and backend import from contracts/exports.

Deployment: Polygon Testnet (Amoy)

1) Get test MATIC
- Use a Polygon Amoy faucet (search “Polygon Amoy faucet”).

2) Get RPC URL
- Create a free project on Alchemy or Infura and select Polygon Amoy.

3) Configure Private Key
- Export from MetaMask test account with small test funds.

4) Deploy as shown above

5) Verify (optional)
- pnpm hardhat verify --network amoy <ADDRESS> <constructor args>

Wallet Integrations

- MetaMask: In-browser provider via window.ethereum
- WalletConnect: Add provider in the frontend for mobile wallets (phase 2)

Env and Secrets

- Never commit private keys
- Use .env files locally; use GitHub Actions/Secrets or your CI secret manager in production

Next Steps

- Add recurring payments via off-chain scheduler + allowance model
- Add email notifications via SendGrid/Resend
- Add fiat on/off-ramp integrations

Troubleshooting

- If events aren’t indexing, ensure RPC_URL supports websockets or poll via getLogs
- If transactions fail, check token approvals and MATIC balance for gas
- Cross-origin errors: confirm VITE_BACKEND_URL and CORS settings

License

MIT


