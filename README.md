# Decentralized Game Card Marketplace (ERC-721)

A complete, production-grade decentralized marketplace web application where users can mint, list, buy, and manage unique digital collectible game cards on Ethereum testnets with IPFS storage.

---

## 1. Project Overview

The **Decentralized Game Card Marketplace** is an end-to-end Web3 platform designed for digital collectible trading cards. Each card exists as a distinct, non-fungible token (NFT) adhering to the standard OpenZeppelin **ERC-721 URIStorage** specification with immutable metadata and artwork hosted on the InterPlanetary File System (IPFS) via Pinata.

### Core Goals
- **Decentralized Trust**: Token ownership, marketplace listings, sales prices, and fund transfers are authoritatively managed by a Solidity smart contract on the blockchain.
- **Permanent Decentralized Storage**: Card artwork binaries and ERC-721 metadata JSON documents are pinned directly to IPFS, ensuring no centralized server dependency.
- **Original Indie Aesthetic**: Styled with a distinctive aesthetic pairing `#171717` dark canvas, `#F4F0E8` warm typography, and `#D97745` ember accents.
- **Comprehensive Test Suite**: Automated Hardhat unit tests with Chai validating 100% of smart contract security checks, reentrancy guards, and edge cases.

---

## 2. Features

- 🎴 **ERC-721 NFT Minting**: Mint custom collectible game cards with unique incrementing token IDs.
- 🌐 **IPFS Image & Metadata Pinning**: Dual-stage Pinata IPFS upload pipeline for raw artwork and ERC-721 JSON schemas.
- ⚡ **Dynamic Gameplay Traits**: Customize flexible attributes (e.g. Element, Class, Attack, Defense, Speed, Magic) per card.
- 👛 **Simulated Wallet & Multi-Account Switcher**: Built-in instant wallet system with Player 1, Player 2, and Player 3. Zero external wallet extension or browser plugin required.
- ⚡ **Simulated Blockchain Engine**: Deterministic on-chain state simulation covering ERC-721 token IDs, atomic purchases, seller payouts, buyer deductions, and 256-bit transaction hashes.
- 🏷️ **Marketplace Listings**: NFT owners can set custom ETH prices and list cards for sale with atomic approvals.
- 🛒 **Trustless Purchasing**: Buyers purchase cards with instant balance settlement, ownership transfer, and provenance logging.
- ❌ **Listing Cancellation**: Verified owners can revoke active marketplace listings at any time.
- 🗄️ **My Collection Garage**: Dedicated user portfolio displaying owned cars, vault status, and listing management.
- 🔍 **Real-Time Search & Rarity Filtering**: Filter by Common, Uncommon, Rare, Epic, Legendary, Mythic, and sort by price or token ID.
- 🛡️ **Durable Client Persistence**: Full local state persistence across sessions and page refreshes without resetting cards, balances, or transaction histories.

---

## 3. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Component-driven UI and strict type safety |
| **Build Tool** | Vite | Ultra-fast development server and production bundler |
| **Styling** | Tailwind CSS v4 | Utility-first responsive design and indie game aesthetic |
| **Web3 Wallet UI** | RainbowKit | Multi-wallet modal connection & network switching |
| **React Web3 Hooks** | Wagmi v2 | React hooks for Ethereum contract reads, writes, and account state |
| **Blockchain Client** | Viem | Lightweight, type-safe EVM client for JSON-RPC calls |
| **Smart Contract** | Solidity ^0.8.24 + OpenZeppelin | ERC-721 URIStorage, ReentrancyGuard, and marketplace mechanics |
| **Smart Contract Tooling** | Hardhat | Local EVM network, compilation, automated tests, and deployment |
| **Testing Suite** | Mocha + Chai + Hardhat Matchers | Unit tests covering minting, listing, buying, and error conditions |
| **IPFS Storage** | Pinata Cloud REST API | Distributed pinning of card images and metadata JSON |

---

## 4. Architecture

### Blockchain Flow
```
[ User Browser ]
       │
       ▼ (Signs with Wallet)
[ RainbowKit / Wagmi / Viem ]
       │
       ▼ (EVM RPC Calls)
[ GameCardMarketplace.sol (ERC-721) ]
       │
       ▼
[ Ethereum Sepolia Testnet ]
```

### IPFS Pinning Flow
```
1. User Selects Artwork (PNG/JPG/SVG)
       │
       ▼
2. Pinata API: /pinning/pinFileToIPFS ──► Returns Image CID (ipfs://QmImageHash)
       │
       ▼
3. Assemble ERC-721 Metadata JSON { name, description, image, attributes }
       │
       ▼
4. Pinata API: /pinning/pinJSONToIPFS ──► Returns Metadata CID (ipfs://QmMetaHash)
       │
       ▼
5. Smart Contract: mintCard("ipfs://QmMetaHash") ──► Mints Token ID
```

---

## 5. Smart Contract Functions

The `GameCardMarketplace.sol` contract combines ERC-721 NFT minting with a gas-efficient, reentrancy-safe decentralized marketplace:

- `mintCard(string memory tokenURI) external returns (uint256)`: Mints a unique card with incrementing token ID pointing to the IPFS metadata URI.
- `listCard(uint256 tokenId, uint256 price) external`: Lists an owned card for sale in wei, requiring token approval.
- `buyCard(uint256 tokenId) external payable`: Purchases an active listing, transfers the NFT to buyer, transfers funds to seller, and refunds any excess payment.
- `cancelListing(uint256 tokenId) external`: Revokes an active listing by the seller.
- `getActiveListings() external view returns (Listing[] memory)`: Returns all currently active marketplace listings.
- `getTokensByOwner(address owner) external view returns (uint256[] memory)`: Queries all token IDs owned by a specific address.
- `getCardDetails(uint256 tokenId) external view returns (string uri, address owner, address seller, uint256 price, bool isListed)`: Single-call helper for fast frontend loading.

---

## 6. Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MetaMask or compatible Web3 wallet extension

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/decentralized-card-marketplace.git
cd decentralized-card-marketplace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in the required configuration:
```env
# Smart Contract Configuration
VITE_CONTRACT_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
VITE_CHAIN_ID="11155111"
VITE_RPC_URL="https://rpc.sepolia.org"

# WalletConnect Project ID (Free at https://cloud.walletconnect.com)
VITE_WALLET_CONNECT_PROJECT_ID="c4f79cc821944d9680842e34466bfb"

# Pinata IPFS (Optional for live Pinata uploads, fallback provided)
VITE_PINATA_JWT="your_pinata_jwt_here"
VITE_PINATA_GATEWAY="https://gateway.pinata.cloud/ipfs"

# Hardhat Deployment Key (For deploying to Sepolia)
PRIVATE_KEY=""
SEPOLIA_RPC_URL="https://rpc.sepolia.org"
```

---

## 7. Smart Contract Compilation & Testing

Run the automated Hardhat test suite:
```bash
npx hardhat test --config hardhat.config.cjs
```

### Test Suite Output:
```
  GameCardMarketplace Smart Contract Tests
    1. Minting
      ✔ Should allow a user to mint a new card
      ✔ Should assign unique and incremental token IDs
      ✔ Should reject minting with an empty token URI
    2. Listing
      ✔ Should allow the card owner to list their card when approved
      ✔ Should prevent non-owners from listing someone else's card
      ✔ Should reject listing if price is 0
      ✔ Should reject listing if contract is not approved
    3. Buying
      ✔ Should allow a buyer to purchase an active listing and transfer NFT and funds
      ✔ Should refund excess payment when buyer overpays
      ✔ Should prevent buying an unlisted or inactive card
      ✔ Should reject purchases with insufficient payment
      ✔ Should prevent seller from buying their own listing
    4. Cancellation
      ✔ Should allow the seller to cancel their active listing
      ✔ Should prevent non-sellers from canceling a listing
    5. Query & Helper Functions
      ✔ Should correctly return active listings and user tokens

  15 passing (1s)
```

---

## 8. Smart Contract Deployment

### Deploy to Local Hardhat Network:
```bash
npx hardhat node
npx hardhat run scripts/deploy.cjs --network localhost --config hardhat.config.cjs
```

### Deploy to Ethereum Sepolia Testnet:
```bash
npx hardhat run scripts/deploy.cjs --network sepolia --config hardhat.config.cjs
```

---

## 9. Start the Frontend Application

Start the local Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 10. Testnet Information & Faucets

- **Target Network**: Ethereum Sepolia
- **Chain ID**: `11155111`
- **Currency**: SepoliaETH
- **Sepolia Faucets**:
  - [Google Cloud Web3 Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
  - [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
  - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- **Block Explorer**: [https://sepolia.etherscan.io](https://sepolia.etherscan.io)

---

## 11. Application Layout & Pages

1. **Marketplace Gallery**: Displays listed cards with prices, rarity badges, seller addresses, real-time search, and sorting controls.
2. **Mint Card Page**: Complete interactive card creator with file upload, dynamic attribute adding/removing, and real-time live card visual preview.
3. **Card Details Modal**: Deep inspection of artwork, gameplay traits, token ID, creator/seller, IPFS CID link, and permission-guarded Buy/List/Cancel buttons.
4. **My Collection**: Vault interface displaying all NFTs owned by the connected wallet, filtering by vault vs listed cards.
5. **Contract & Specs**: Live interactive documentation showing test reports, CLI commands, and architecture diagrams.

---

## 12. License

MIT License — Built as a student Web3 engineering project.
