const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameCardMarketplace Smart Contract Tests", function () {
  let marketplace;
  let owner;
  let seller;
  let buyer;
  let bidder2;
  let addrs;

  const sampleURI1 = "ipfs://QmSampleHash1/metadata.json";
  const sampleURI2 = "ipfs://QmSampleHash2/metadata.json";
  const samplePrice = ethers.parseEther("0.05");
  const updatedPrice = ethers.parseEther("0.08");

  beforeEach(async function () {
    [owner, seller, buyer, bidder2, ...addrs] = await ethers.getSigners();
    const GameCardMarketplace = await ethers.getContractFactory("GameCardMarketplace");
    marketplace = await GameCardMarketplace.deploy();
    await marketplace.waitForDeployment();
  });

  describe("1. Minting", function () {
    it("Should allow a user to mint a new card", async function () {
      const tx = await marketplace.connect(seller).mintCard(sampleURI1);
      await expect(tx)
        .to.emit(marketplace, "CardMinted")
        .withArgs(1, seller.address, sampleURI1);

      expect(await marketplace.ownerOf(1)).to.equal(seller.address);
      expect(await marketplace.tokenURI(1)).to.equal(sampleURI1);
    });

    it("Should assign unique and incremental token IDs", async function () {
      await marketplace.connect(seller).mintCard(sampleURI1);
      await marketplace.connect(buyer).mintCard(sampleURI2);

      expect(await marketplace.ownerOf(1)).to.equal(seller.address);
      expect(await marketplace.ownerOf(2)).to.equal(buyer.address);
      expect(await marketplace.totalMinted()).to.equal(2);
    });

    it("Should reject minting with an empty token URI", async function () {
      await expect(
        marketplace.connect(seller).mintCard("")
      ).to.be.revertedWith("Token URI cannot be empty");
    });
  });

  describe("2. Fixed-Price Listing & Price Updates", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).mintCard(sampleURI1);
    });

    it("Should allow the card owner to list their card when approved", async function () {
      const contractAddress = await marketplace.getAddress();
      await marketplace.connect(seller).approve(contractAddress, 1);

      const tx = await marketplace.connect(seller).listCard(1, samplePrice);
      await expect(tx)
        .to.emit(marketplace, "CardListed")
        .withArgs(1, seller.address, samplePrice);

      const listing = await marketplace.listings(1);
      expect(listing.tokenId).to.equal(1);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(samplePrice);
      expect(listing.isActive).to.be.true;
    });

    it("Should allow seller to update listing price", async function () {
      const contractAddress = await marketplace.getAddress();
      await marketplace.connect(seller).approve(contractAddress, 1);
      await marketplace.connect(seller).listCard(1, samplePrice);

      const tx = await marketplace.connect(seller).updateListingPrice(1, updatedPrice);
      await expect(tx)
        .to.emit(marketplace, "CardPriceUpdated")
        .withArgs(1, seller.address, updatedPrice);

      const listing = await marketplace.listings(1);
      expect(listing.price).to.equal(updatedPrice);
    });

    it("Should prevent non-sellers from updating listing price", async function () {
      const contractAddress = await marketplace.getAddress();
      await marketplace.connect(seller).approve(contractAddress, 1);
      await marketplace.connect(seller).listCard(1, samplePrice);

      await expect(
        marketplace.connect(buyer).updateListingPrice(1, updatedPrice)
      ).to.be.revertedWith("Only the seller can update listing price");
    });

    it("Should reject updating price to 0", async function () {
      const contractAddress = await marketplace.getAddress();
      await marketplace.connect(seller).approve(contractAddress, 1);
      await marketplace.connect(seller).listCard(1, samplePrice);

      await expect(
        marketplace.connect(seller).updateListingPrice(1, 0)
      ).to.be.revertedWith("Price must be greater than zero");
    });

    it("Should prevent non-owners from listing someone else's card", async function () {
      const contractAddress = await marketplace.getAddress();
      await marketplace.connect(seller).approve(contractAddress, 1);

      await expect(
        marketplace.connect(buyer).listCard(1, samplePrice)
      ).to.be.revertedWith("Caller is not the card owner");
    });

    it("Should reject listing if price is 0", async function () {
      const contractAddress = await marketplace.getAddress();
      await marketplace.connect(seller).approve(contractAddress, 1);

      await expect(
        marketplace.connect(seller).listCard(1, 0)
      ).to.be.revertedWith("Price must be greater than zero");
    });

    it("Should reject listing if contract is not approved", async function () {
      await expect(
        marketplace.connect(seller).listCard(1, samplePrice)
      ).to.be.revertedWith("Marketplace is not approved to transfer card");
    });
  });

  describe("3. Buying Fixed-Price Listings", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).mintCard(sampleURI1);
      const contractAddress = await marketplace.getAddress();
      await marketplace.connect(seller).approve(contractAddress, 1);
      await marketplace.connect(seller).listCard(1, samplePrice);
    });

    it("Should allow a buyer to purchase an active listing and transfer NFT and funds", async function () {
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);

      const tx = await marketplace.connect(buyer).buyCard(1, { value: samplePrice });
      await expect(tx)
        .to.emit(marketplace, "CardSold")
        .withArgs(1, seller.address, buyer.address, samplePrice);

      // Verify NFT ownership changed
      expect(await marketplace.ownerOf(1)).to.equal(buyer.address);

      // Verify listing deactivated
      const listing = await marketplace.listings(1);
      expect(listing.isActive).to.be.false;

      // Verify seller received funds
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(samplePrice);
    });

    it("Should refund excess payment when buyer overpays", async function () {
      const excess = ethers.parseEther("0.02");
      const totalSent = samplePrice + excess;

      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
      const tx = await marketplace.connect(buyer).buyCard(1, { value: totalSent });
      const receipt = await tx.wait();
      const gasSpent = receipt.gasUsed * receipt.gasPrice;

      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);
      expect(buyerBalanceBefore - buyerBalanceAfter - gasSpent).to.equal(samplePrice);
    });

    it("Should prevent buying an unlisted or inactive card", async function () {
      await marketplace.connect(seller).cancelListing(1);
      await expect(
        marketplace.connect(buyer).buyCard(1, { value: samplePrice })
      ).to.be.revertedWith("Listing is not active");
    });

    it("Should reject purchases with insufficient payment", async function () {
      const insufficient = ethers.parseEther("0.01");
      await expect(
        marketplace.connect(buyer).buyCard(1, { value: insufficient })
      ).to.be.revertedWith("Insufficient payment sent");
    });

    it("Should prevent seller from buying their own listing", async function () {
      await expect(
        marketplace.connect(seller).buyCard(1, { value: samplePrice })
      ).to.be.revertedWith("Seller cannot buy own listing");
    });
  });

  describe("4. Cancellation of Fixed-Price Listings", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).mintCard(sampleURI1);
      const contractAddress = await marketplace.getAddress();
      await marketplace.connect(seller).approve(contractAddress, 1);
      await marketplace.connect(seller).listCard(1, samplePrice);
    });

    it("Should allow the seller to cancel their active listing", async function () {
      const tx = await marketplace.connect(seller).cancelListing(1);
      await expect(tx)
        .to.emit(marketplace, "ListingCancelled")
        .withArgs(1, seller.address);

      const listing = await marketplace.listings(1);
      expect(listing.isActive).to.be.false;
    });

    it("Should prevent non-sellers from canceling a listing", async function () {
      await expect(
        marketplace.connect(buyer).cancelListing(1)
      ).to.be.revertedWith("Only the seller can cancel listing");
    });
  });

  describe("5. Query & Helper Functions", function () {
    it("Should correctly return active listings and user tokens", async function () {
      await marketplace.connect(seller).mintCard(sampleURI1); // Token 1
      await marketplace.connect(seller).mintCard(sampleURI2); // Token 2
      await marketplace.connect(buyer).mintCard("ipfs://QmOther"); // Token 3

      const contractAddress = await marketplace.getAddress();
      await marketplace.connect(seller).approve(contractAddress, 1);

      // List token 1 as fixed-price
      await marketplace.connect(seller).listCard(1, samplePrice);

      const activeListings = await marketplace.getActiveListings();
      expect(activeListings.length).to.equal(1);
      expect(activeListings[0].tokenId).to.equal(1);

      const sellerTokens = await marketplace.getTokensByOwner(seller.address);
      expect(sellerTokens.length).to.equal(2);

      const buyerTokens = await marketplace.getTokensByOwner(buyer.address);
      expect(buyerTokens.length).to.equal(1);
      expect(buyerTokens[0]).to.equal(3);

      const details = await marketplace.getCardDetails(1);
      expect(details.uri).to.equal(sampleURI1);
      expect(details.owner).to.equal(seller.address);
      expect(details.seller).to.equal(seller.address);
      expect(details.price).to.equal(samplePrice);
      expect(details.isListed).to.be.true;
    });
  });
});

