# PayLink Smart Contracts (Polygon Amoy)

This document explains how the PayLink smart contracts work, the on-chain components, their responsibilities, and how they fit into the overall system.

## Components

- PaymentGateway.sol
  - Minimal payment router for native MATIC and allowlisted ERC-20 tokens.
  - Emits a canonical `Payment` event for off-chain indexing (backend + dashboard updates).
  - Supports immediate forward of funds to a receiver wallet (EOA) to keep custody with users.

- ReceiptNFT.sol
  - Minimal ERC-721 for optional "receipt" NFTs.
  - Minted by the contract owner (backend) to a recipient’s wallet, with metadata stored on IPFS.

## PaymentGateway.sol

### Purpose
Provide a single entry-point for receiving payments to a user’s PayLink (slug) with low gas and simple UX. The gateway forwards funds directly to the receiver to avoid custodial risk while preserving a uniform event log.

### Key Storage
- `mapping(address => TokenInfo) public allowedTokens;`
  - Allowlist for ERC-20 tokens. `address(0)` denotes native MATIC.
  - `TokenInfo { bool isAllowed; uint8 decimals; }` (decimals are informational for off-chain UIs.)

### Events
- `event Payment(address indexed payer, address indexed receiver, address indexed token, uint256 amount, string slug, string memo, uint256 timestamp);`
  - Emitted on each successful payment (native or ERC-20).
  - Used by the backend to index payments and power dashboards/analytics.

- `event TokenAllowlistUpdated(address indexed token, bool isAllowed, uint8 decimals);`
  - Emitted whenever an ERC-20 is allowlisted/removed.

### External Functions
- `setAllowedToken(address token, bool isAllowed, uint8 decimals)`
  - Owner-only (deployer) method to manage ERC-20 allowlist.
  - Example: allow USDC with 6 decimals.

- `payNative(address receiver, string slug, string memo)` (payable)
  - Sends `msg.value` MATIC directly to `receiver` and emits `Payment`.
  - Reverts if `msg.value == 0`.
  - Notes:
    - `receiver` should be an EOA (externally-owned account). Paying contracts that reject value will revert.

- `payERC20(address token, uint256 amount, address receiver, string slug, string memo)`
  - Transfers `amount` of `token` from `msg.sender` to `receiver` using `transferFrom`.
  - Requires prior `approve(gateway, amount)` from `msg.sender` to the token contract.
  - Reverts if token not allowlisted or amount is 0 or transfer fails.

### Receive / Fallback
- `receive()` reverts with `DIRECT_TRANSFER_BLOCKED` to force use of functions that emit events.

### Design Rationale
- Immediate Forwarding
  - Users keep custody in their own wallets; the gateway only coordinates.
  - Simpler legal/compliance posture than pooled custody.

- Event-First Architecture
  - Backend listens on `Payment` events and persists off-chain records (payer, receiver, amount, token, memo, timestamp, tx hash).
  - Enables dashboards, summaries, and developer APIs without on-chain reads.

- Allowlist for ERC-20s
  - Prevents arbitrary tokens that could be malicious or confuse users.

### Security Considerations
- Reentrancy: No state is modified after external calls (simple forwarding), so risk is minimal.
- Token Safety: Use caution with non-standard ERC-20s. Stick to well-known tokens and test thoroughly.
- Receiver Type: Forwarding MATIC to contracts may fail; UI should block contract receivers (implemented in the frontend).
- Ownership: Only the owner can update allowlist; keep deployer keys secure. Consider a multisig for mainnet.

### Gas & Fees
- Users pay Polygon gas fees (very low on Amoy and mainnet relative to L1).
- No protocol fee is charged by the contract in this MVP. A fee model can be added later by forwarding a percentage to a treasury.

## ReceiptNFT.sol

### Purpose
- Mint proof-of-payment NFTs as receipts. Optional: can be automated by the backend after successful payments.

### Key Storage
- `string public baseURI;`
- `uint256 public nextTokenId;`

### Functions
- `mint(address to)` (owner-only) → returns `tokenId`
  - Mints a new NFT to `to`.
  - Backend sets `baseURI` to an IPFS gateway prefix; individual tokenURIs follow `<baseURI><tokenId>.json`.

- `setBaseURI(string newBaseURI)` (owner-only)
  - Allows rotating the metadata base.

- `tokenURI(uint256 tokenId)`
  - Returns `<baseURI><tokenId>.json`.

### Metadata
- Upload JSON to IPFS (e.g., Pinata) containing payment metadata, such as:
  - payer, receiver, tx hash, amount, token, slug, timestamp, memo.

## Typical Payment Flow (Native MATIC)
1. Visitor opens `/pay/:slug` on the frontend.
2. Frontend fetches receiver wallet via backend `/api/users/by-slug/:slug`.
3. User enters amount + memo → clicks Pay.
4. Frontend calls `PaymentGateway.payNative(receiver, slug, memo)` with `value`.
5. Contract forwards MATIC to `receiver` and emits `Payment` event.
6. Backend listener indexes `Payment` → dashboard shows the new payment.
7. (Optional) Backend uploads metadata to IPFS and mints a `ReceiptNFT` to the receiver.

## ERC-20 Flow (Planned UX)
1. Frontend displays a known allowlisted token (e.g., USDC) with its contract address.
2. Payer approves the gateway for `amount` via `token.approve(gateway, amount)`.
3. Frontend calls `PaymentGateway.payERC20(token, amount, receiver, slug, memo)`.
4. Contract emits `Payment`; backend indexes; optional receipt NFT minted.

## Escrow / Withdrawals (Extension)
- This MVP forwards funds immediately. To support escrow:
  - Add mapping of balances per user and token.
  - Accept funds into contract, emit `Payment`, and credit internal balance.
  - Provide `withdraw()` to let receivers claim later (could add fee, limits, or KYC gates if needed).

## Integration Points
- Frontend
  - `payNative`/`payERC20` via `ethers.js` + MetaMask/WalletConnect.
  - Event-only indexing simplifies client reads (no on-chain queries needed for lists/analytics).

- Backend
  - Subscribes to `Payment` events.
  - Persists to MongoDB: payer, receiver, token, amount, slug, memo, tx hash, timestamp.
  - Exposes APIs for dashboard lists and summaries.
  - (Optional) Mints Receipt NFTs and uploads metadata to IPFS.

## Deployment
- Network: Polygon Amoy (testnet). Mainnet compatible.
- Script: `contracts/scripts/deploy.ts` deploys `PaymentGateway` and `ReceiptNFT`.
- Post-Deploy: Optionally allowlist ERC-20 tokens using `setAllowedToken`.

## Addresses (Your Deployment)
- PaymentGateway: set from your deploy output
- ReceiptNFT: set from your deploy output

## Upgrades & Future Work
- WalletConnect integration on frontend.
- ERC-20 UX (approval + pay) for stablecoins.
- Protocol fee toggle.
- Escrow with withdraw and subscription logic.
- On-chain price oracles for fiat display (off-chain in MVP).
- Multi-sig ownership for allowlist and NFT contract.


