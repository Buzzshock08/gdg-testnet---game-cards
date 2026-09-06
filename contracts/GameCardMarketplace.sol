// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GameCardMarketplace
 * @dev An all-in-one ERC-721 digital collectible car contract and decentralized marketplace.
 * Allows users to mint unique cards with IPFS metadata URIs, list cards for fixed-price sale in ETH,
 * update listing prices, cancel listings, and purchase cards with reentrancy protection.
 */
contract GameCardMarketplace is ERC721URIStorage, ReentrancyGuard {
    // Counter for unique incremental token IDs
    uint256 private _nextTokenId;

    // Fixed-Price Listing data structure
    struct Listing {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool isActive;
    }

    // Mapping from tokenId to Listing
    mapping(uint256 => Listing) public listings;

    // Array of all token IDs minted
    uint256[] private _allTokenIds;

    // Events
    event CardMinted(uint256 indexed tokenId, address indexed minter, string tokenURI);
    event CardListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event CardPriceUpdated(uint256 indexed tokenId, address indexed seller, uint256 newPrice);
    event CardSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event ListingCancelled(uint256 indexed tokenId, address indexed seller);

    constructor() ERC721("APEXCARDS Collectible Vehicles", "APEX") {
        _nextTokenId = 1;
    }

    /**
     * @notice Mint a new unique game card NFT pointing to an IPFS metadata URI
     * @param tokenURI The IPFS metadata URI (e.g. ipfs://CID or https://...)
     * @return tokenId The unique ID assigned to the minted card
     */
    function mintCard(string memory tokenURI) external nonReentrant returns (uint256) {
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _allTokenIds.push(tokenId);

        emit CardMinted(tokenId, msg.sender, tokenURI);
        return tokenId;
    }

    // ==========================================
    // FIXED-PRICE MARKETPLACE
    // ==========================================

    /**
     * @notice List an owned game card NFT on the marketplace for fixed-price sale
     * @param tokenId The ID of the card to list
     * @param price The listing price in wei
     */
    function listCard(uint256 tokenId, uint256 price) external nonReentrant {
        require(_ownerOf(tokenId) == msg.sender, "Caller is not the card owner");
        require(price > 0, "Price must be greater than zero");

        // Ensure marketplace contract is approved to transfer the token
        require(
            getApproved(tokenId) == address(this) || isApprovedForAll(msg.sender, address(this)),
            "Marketplace is not approved to transfer card"
        );

        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: payable(msg.sender),
            price: price,
            isActive: true
        });

        emit CardListed(tokenId, msg.sender, price);
    }

    /**
     * @notice Update the price of an active listing
     * @param tokenId The ID of the card
     * @param newPrice The new listing price in wei
     */
    function updateListingPrice(uint256 tokenId, uint256 newPrice) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Listing is not active");
        require(listing.seller == msg.sender, "Only the seller can update listing price");
        require(_ownerOf(tokenId) == msg.sender, "Caller is no longer the card owner");
        require(newPrice > 0, "Price must be greater than zero");

        listing.price = newPrice;

        emit CardPriceUpdated(tokenId, msg.sender, newPrice);
    }

    /**
     * @notice Purchase an active card listing
     * @param tokenId The ID of the card to purchase
     */
    function buyCard(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.isActive, "Listing is not active");
        require(msg.value >= listing.price, "Insufficient payment sent");
        require(msg.sender != listing.seller, "Seller cannot buy own listing");
        require(_ownerOf(tokenId) == listing.seller, "Seller is no longer the owner");

        // Deactivate listing first to prevent reentrancy issues
        listings[tokenId].isActive = false;

        address payable seller = listing.seller;
        uint256 price = listing.price;

        // Transfer NFT from seller to buyer
        _transfer(seller, msg.sender, tokenId);

        // Transfer payment to seller
        (bool success, ) = seller.call{value: price}("");
        require(success, "Payment transfer to seller failed");

        // Refund any excess payment to buyer
        if (msg.value > price) {
            uint256 excess = msg.value - price;
            (bool refundSuccess, ) = payable(msg.sender).call{value: excess}("");
            require(refundSuccess, "Excess refund failed");
        }

        emit CardSold(tokenId, seller, msg.sender, price);
    }

    /**
     * @notice Cancel an active listing by the seller
     * @param tokenId The ID of the card to cancel listing for
     */
    function cancelListing(uint256 tokenId) external nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.isActive, "Listing is not active");
        require(listing.seller == msg.sender, "Only the seller can cancel listing");

        listings[tokenId].isActive = false;

        emit ListingCancelled(tokenId, msg.sender);
    }

    // ==========================================
    // VIEWS & QUERY HELPERS
    // ==========================================

    /**
     * @notice Get all active fixed-price listings on the marketplace
     */
    function getActiveListings() external view returns (Listing[] memory) {
        uint256 total = _allTokenIds.length;
        uint256 activeCount = 0;

        for (uint256 i = 0; i < total; i++) {
            uint256 tid = _allTokenIds[i];
            if (listings[tid].isActive && _ownerOf(tid) == listings[tid].seller) {
                activeCount++;
            }
        }

        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < total; i++) {
            uint256 tid = _allTokenIds[i];
            if (listings[tid].isActive && _ownerOf(tid) == listings[tid].seller) {
                activeListings[currentIndex] = listings[tid];
                currentIndex++;
            }
        }

        return activeListings;
    }

    /**
     * @notice Get all token IDs owned by a specific address
     * @param owner The wallet address to query
     */
    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        uint256 total = _allTokenIds.length;
        uint256 matchCount = 0;

        for (uint256 i = 0; i < total; i++) {
            if (_ownerOf(_allTokenIds[i]) == owner) {
                matchCount++;
            }
        }

        uint256[] memory result = new uint256[](matchCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < total; i++) {
            if (_ownerOf(_allTokenIds[i]) == owner) {
                result[currentIndex] = _allTokenIds[i];
                currentIndex++;
            }
        }

        return result;
    }

    /**
     * @notice Get full card details in a single view call for fast UI loading
     * @param tokenId The ID of the card
     */
    function getCardDetails(uint256 tokenId) external view returns (
        string memory uri,
        address owner,
        address seller,
        uint256 price,
        bool isListed
    ) {
        require(_ownerOf(tokenId) != address(0), "Card does not exist");
        uri = tokenURI(tokenId);
        owner = _ownerOf(tokenId);

        Listing memory listing = listings[tokenId];
        seller = listing.seller;
        price = listing.price;
        isListed = listing.isActive && (owner == seller);
    }

    /**
     * @notice Total number of cards minted so far
     */
    function totalMinted() external view returns (uint256) {
        return _allTokenIds.length;
    }

    /**
     * @notice Returns all token IDs minted
     */
    function getAllTokenIds() external view returns (uint256[] memory) {
        return _allTokenIds;
    }
}

