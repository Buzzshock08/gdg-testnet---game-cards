import { useState, useEffect, useCallback } from 'react';
import { CardItem, TransactionState, NFTMetadata } from '../types/card';
import {
  simulatedBlockchain,
  generateSimulatedTxHash,
} from '../services/simulatedBlockchain';
import { useSimulatedWallet } from '../context/SimulatedWalletContext';
import {
  uploadImageToPinata,
  uploadMetadataToPinata,
} from '../services/pinata';
import confetti from 'canvas-confetti';

export function useMarketplace() {
  const { account, address, isConnected, refreshWallet } = useSimulatedWallet();

  const [cards, setCards] = useState<CardItem[]>(() => simulatedBlockchain.getCards());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnChain, setIsOnChain] = useState<boolean>(true); // Simulated EVM on-chain state
  const [txState, setTxState] = useState<TransactionState>({ status: 'idle' });

  // Sync cards state with the simulated blockchain service
  const refreshMarketplace = useCallback(() => {
    const currentCards = simulatedBlockchain.getCards();
    setCards(currentCards);
    refreshWallet();
  }, [refreshWallet]);

  useEffect(() => {
    refreshMarketplace();
  }, [refreshMarketplace, address]);

  /**
   * 1. Complete Mint Flow (Using Simulated Wallet + Simulated Blockchain)
   */
  const mintCard = async (
    imageFile: File | Blob,
    metadata: Omit<NFTMetadata, 'image'>
  ): Promise<{ tokenId: number; txHash: string; ipfsUri: string }> => {
    try {
      setTxState({
        status: 'uploading_image',
        message: 'Uploading vehicle artwork to IPFS (Pinata)...',
      });

      // Attempt Pinata upload or fallback to data URL
      const imageResult = await uploadImageToPinata(imageFile, `${metadata.name}-artwork.png`);

      setTxState({
        status: 'uploading_metadata',
        message: 'Pinning verified ERC-721 vehicle metadata to IPFS...',
      });

      const fullMetadata: NFTMetadata = {
        ...metadata,
        image: imageResult.ipfsUri,
        created_at: new Date().toISOString(),
      };

      const metadataResult = await uploadMetadataToPinata(fullMetadata, metadata.name);

      setTxState({
        status: 'waiting_wallet',
        message: `Preparing simulated transaction for ${account.name}...`,
      });

      // Simulate realistic blockchain preparation delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const txHash = generateSimulatedTxHash();
      const currentBlock = simulatedBlockchain.incrementBlock();

      setTxState({
        status: 'confirming',
        message: 'Processing simulated block confirmation on Sepolia...',
        txHash,
      });

      // Simulate block confirmation
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Calculate next unique incremental tokenId
      const existingCards = simulatedBlockchain.getCards();
      const maxTokenId = existingCards.reduce((max, c) => Math.max(max, c.tokenId), 0);
      const assignedTokenId = maxTokenId + 1;

      const newCard: CardItem = {
        tokenId: assignedTokenId,
        tokenURI: metadataResult.ipfsUri,
        name: metadata.name,
        description: metadata.description,
        image: imageResult.gatewayUrl,
        rarity: metadata.rarity || 'Common',
        attributes: metadata.attributes,
        owner: address,
        isListed: false,
        rawMetadata: fullMetadata,
        history: [
          {
            id: `act-${assignedTokenId}-mint`,
            type: 'Mint',
            from: '0x0000000000000000000000000000000000000000',
            to: address,
            timestamp: Date.now(),
            txHash,
          },
        ],
      };

      // Record simulated transaction record
      simulatedBlockchain.addTransaction({
        txHash,
        type: 'Mint',
        from: '0x0000000000000000000000000000000000000000',
        to: address,
        tokenId: assignedTokenId,
        tokenName: metadata.name,
        timestamp: Date.now(),
        blockNumber: currentBlock,
        status: 'confirmed',
      });

      const updatedCards = [newCard, ...existingCards];
      simulatedBlockchain.saveCards(updatedCards);
      setCards(updatedCards);
      refreshWallet();

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#EA580C', '#38BDF8', '#10B981', '#F59E0B'],
        });
      } catch (e) {}

      setTxState({
        status: 'success',
        message: `Successfully minted ${metadata.name}! Token #${assignedTokenId} added to your garage.`,
        tokenId: assignedTokenId,
        txHash,
      });

      return { tokenId: assignedTokenId, txHash, ipfsUri: metadataResult.ipfsUri };
    } catch (err: any) {
      console.error('Minting error:', err);
      setTxState({
        status: 'error',
        error: err?.message || 'Failed to mint vehicle NFT.',
      });
      throw err;
    }
  };

  /**
   * 2. List Card for Fixed Price Sale
   */
  const listCard = async (tokenId: number, priceEth: string) => {
    try {
      const priceFloat = parseFloat(priceEth);
      if (isNaN(priceFloat) || priceFloat <= 0) {
        throw new Error('Please enter a valid price greater than 0 ETH');
      }

      setTxState({
        status: 'waiting_wallet',
        message: `Approving marketplace contract & signing simulated listing for ${priceEth} ETH...`,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const txHash = generateSimulatedTxHash();
      const currentBlock = simulatedBlockchain.incrementBlock();

      setTxState({
        status: 'confirming',
        message: 'Updating simulated on-chain marketplace listing...',
        txHash,
      });

      await new Promise((resolve) => setTimeout(resolve, 600));

      const currentCards = simulatedBlockchain.getCards();
      const targetCard = currentCards.find((c) => c.tokenId === tokenId);

      const updatedCards = currentCards.map((c) => {
        if (c.tokenId === tokenId) {
          return {
            ...c,
            isListed: true,
            price: priceEth,
            seller: address,
            history: [
              {
                id: `act-${tokenId}-list-${Date.now()}`,
                type: 'List',
                from: address,
                price: priceEth,
                timestamp: Date.now(),
                txHash,
              },
              ...(c.history || []),
            ],
          };
        }
        return c;
      });

      simulatedBlockchain.saveCards(updatedCards);
      setCards(updatedCards);

      simulatedBlockchain.addTransaction({
        txHash,
        type: 'List',
        from: address,
        tokenId,
        tokenName: targetCard?.name,
        priceEth,
        timestamp: Date.now(),
        blockNumber: currentBlock,
        status: 'confirmed',
      });

      refreshWallet();

      setTxState({
        status: 'success',
        message: `Vehicle #${tokenId} is now listed for ${priceEth} ETH on the marketplace!`,
        txHash,
      });
    } catch (err: any) {
      console.error('List error:', err);
      setTxState({
        status: 'error',
        error: err?.message || 'Failed to list vehicle.',
      });
      throw err;
    }
  };

  /**
   * 3. Update Listing Price
   */
  const updateListingPrice = async (tokenId: number, newPriceEth: string) => {
    try {
      const priceFloat = parseFloat(newPriceEth);
      if (isNaN(priceFloat) || priceFloat <= 0) {
        throw new Error('Please enter a valid price greater than 0 ETH');
      }

      setTxState({
        status: 'waiting_wallet',
        message: `Updating simulated listing price of #${tokenId} to ${newPriceEth} ETH...`,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const txHash = generateSimulatedTxHash();
      const currentBlock = simulatedBlockchain.incrementBlock();

      setTxState({
        status: 'confirming',
        message: 'Broadcasting price update to simulated ledger...',
        txHash,
      });

      await new Promise((resolve) => setTimeout(resolve, 600));

      const currentCards = simulatedBlockchain.getCards();
      const targetCard = currentCards.find((c) => c.tokenId === tokenId);

      const updatedCards = currentCards.map((c) => {
        if (c.tokenId === tokenId) {
          return {
            ...c,
            price: newPriceEth,
            history: [
              {
                id: `act-${tokenId}-price-${Date.now()}`,
                type: 'PriceUpdate',
                from: address,
                price: newPriceEth,
                timestamp: Date.now(),
                txHash,
              },
              ...(c.history || []),
            ],
          };
        }
        return c;
      });

      simulatedBlockchain.saveCards(updatedCards);
      setCards(updatedCards);

      simulatedBlockchain.addTransaction({
        txHash,
        type: 'PriceUpdate',
        from: address,
        tokenId,
        tokenName: targetCard?.name,
        priceEth: newPriceEth,
        timestamp: Date.now(),
        blockNumber: currentBlock,
        status: 'confirmed',
      });

      refreshWallet();

      setTxState({
        status: 'success',
        message: `Price for Vehicle #${tokenId} updated to ${newPriceEth} ETH!`,
        txHash,
      });
    } catch (err: any) {
      console.error('Update price error:', err);
      setTxState({
        status: 'error',
        error: err?.message || 'Failed to update listing price.',
      });
      throw err;
    }
  };

  /**
   * 4. Buy Fixed-Price Listing
   * Deducts purchase price from buyer, adds to seller, transfers card ownership, updates history & balances
   */
  const buyCard = async (tokenId: number) => {
    try {
      const currentCards = simulatedBlockchain.getCards();
      const card = currentCards.find((c) => c.tokenId === tokenId);

      if (!card || !card.price) {
        throw new Error('Card is not listed for sale.');
      }

      const costEth = parseFloat(card.price);

      // Verify buyer balance
      if (account.balanceEth < costEth) {
        throw new Error(
          `Insufficient simulated ETH balance. You need ${card.price} ETH, but current balance is ${account.balanceEth.toFixed(
            4
          )} ETH.`
        );
      }

      // Check self-purchase
      const sellerAddress = card.seller || card.owner;
      if (sellerAddress.toLowerCase() === address.toLowerCase()) {
        throw new Error('You cannot purchase a vehicle you already listed for sale.');
      }

      setTxState({
        status: 'waiting_wallet',
        message: `Confirming simulated purchase of #${tokenId} for ${card.price} ETH with ${account.name}...`,
      });

      await new Promise((resolve) => setTimeout(resolve, 600));

      const txHash = generateSimulatedTxHash();
      const currentBlock = simulatedBlockchain.incrementBlock();

      setTxState({
        status: 'confirming',
        message: 'Processing asset transfer and fund settlement on simulated ledger...',
        txHash,
      });

      await new Promise((resolve) => setTimeout(resolve, 800));

      // 1. Deduct cost from buyer
      simulatedBlockchain.adjustAccountBalance(address, -costEth);

      // 2. Add proceeds to seller
      simulatedBlockchain.adjustAccountBalance(sellerAddress, costEth);

      // 3. Update card ownership and delist
      const updatedCards = currentCards.map((c) => {
        if (c.tokenId === tokenId) {
          return {
            ...c,
            owner: address,
            isListed: false,
            seller: undefined,
            history: [
              {
                id: `act-${tokenId}-sale-${Date.now()}`,
                type: 'Sale',
                from: sellerAddress,
                to: address,
                price: c.price,
                timestamp: Date.now(),
                txHash,
              },
              ...(c.history || []),
            ],
          };
        }
        return c;
      });

      simulatedBlockchain.saveCards(updatedCards);
      setCards(updatedCards);

      // 4. Record transaction in blockchain history
      simulatedBlockchain.addTransaction({
        txHash,
        type: 'Sale',
        from: sellerAddress,
        to: address,
        tokenId,
        tokenName: card.name,
        priceEth: card.price,
        timestamp: Date.now(),
        blockNumber: currentBlock,
        status: 'confirmed',
      });

      refreshWallet();

      try {
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#10B981', '#EA580C', '#38BDF8'],
        });
      } catch (e) {}

      setTxState({
        status: 'success',
        message: `Successfully purchased ${card.name} (#${tokenId})! It has been transferred to your garage.`,
        txHash,
      });
    } catch (err: any) {
      console.error('Buy error:', err);
      setTxState({
        status: 'error',
        error: err?.message || 'Failed to purchase vehicle.',
      });
      throw err;
    }
  };

  /**
   * 5. Cancel Fixed-Price Listing
   */
  const cancelListing = async (tokenId: number) => {
    try {
      setTxState({
        status: 'waiting_wallet',
        message: `Signing cancellation of listing #${tokenId}...`,
      });

      await new Promise((resolve) => setTimeout(resolve, 400));

      const txHash = generateSimulatedTxHash();
      const currentBlock = simulatedBlockchain.incrementBlock();

      setTxState({
        status: 'confirming',
        message: 'Removing vehicle from active marketplace listings...',
        txHash,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const currentCards = simulatedBlockchain.getCards();
      const targetCard = currentCards.find((c) => c.tokenId === tokenId);

      const updatedCards = currentCards.map((c) => {
        if (c.tokenId === tokenId) {
          return {
            ...c,
            isListed: false,
            seller: undefined,
            history: [
              {
                id: `act-${tokenId}-cancel-${Date.now()}`,
                type: 'Cancel',
                from: address,
                timestamp: Date.now(),
                txHash,
              },
              ...(c.history || []),
            ],
          };
        }
        return c;
      });

      simulatedBlockchain.saveCards(updatedCards);
      setCards(updatedCards);

      simulatedBlockchain.addTransaction({
        txHash,
        type: 'Cancel',
        from: address,
        tokenId,
        tokenName: targetCard?.name,
        timestamp: Date.now(),
        blockNumber: currentBlock,
        status: 'confirmed',
      });

      refreshWallet();

      setTxState({
        status: 'success',
        message: `Listing for Vehicle #${tokenId} has been cancelled and returned to your vault.`,
        txHash,
      });
    } catch (err: any) {
      console.error('Cancel listing error:', err);
      setTxState({
        status: 'error',
        error: err?.message || 'Failed to cancel listing.',
      });
      throw err;
    }
  };

  const resetTxState = () => {
    setTxState({ status: 'idle' });
  };

  return {
    cards,
    isLoading,
    isOnChain,
    txState,
    resetTxState,
    mintCard,
    listCard,
    updateListingPrice,
    buyCard,
    cancelListing,
    refreshMarketplace,
  };
}
