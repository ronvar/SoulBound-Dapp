import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { NftEventWithMetadata } from "../../types/amoy";

const soulBoundABI = require("./soulbound.json");
const contractAddress = "0xA57CC3065E049d50D4f2D10F614FCfA6A8CA8eb5";
const amoyTestnetRpcUrl = "https://rpc-amoy.polygon.technology";

/* EVENT LOG EXAMPLE 
EventLog {
    provider: JsonRpcProvider {},
    transactionHash: '0x45e3f5c44138cf343be50504df479386d68d0049e834897a793333e12eb86bd7',
    blockHash: '0x40c15afdc4038de25140f9dce462a643a585b96517017ac4d743fdf13ccc115a',
    blockNumber: 8299954,
    removed: false,
    address: '0xA57CC3065E049d50D4f2D10F614FCfA6A8CA8eb5',
    data: '0x',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0x000000000000000000000000a91b7aac77fef8d11c5c076c2f48c0e00113aedb',
      '0x0000000000000000000000000000000000000000000000000000000000000001'
    ],
    index: 0,
    transactionIndex: 0,
    interface: Interface {
      fragments: [Array],
      deploy: [ConstructorFragment],
      fallback: null,
      receive: false
    },
    fragment: EventFragment {
      type: 'event',
      inputs: [Array],
      name: 'Transfer',
      anonymous: false
    },
    args: Result(3) [
      '0x0000000000000000000000000000000000000000',
      '0xA91b7aAC77fEF8D11C5C076C2F48c0E00113AEDB',
      1n
    ]
  }
*/

export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(amoyTestnetRpcUrl);
};

export const getWallet = (
  provider: ethers.providers.JsonRpcProvider,
  walletAddress: string
) => {
  return new ethers.Wallet(walletAddress, provider);
};

export const getSigner = (
  provider: ethers.providers.JsonRpcProvider,
  userWallet: ethers.Wallet
) => {
  if (!userWallet) {
    throw new Error("User address is required");
  }

  return provider.getSigner(userWallet.privateKey);
};

export const getContract = (
  provider: ethers.providers.JsonRpcProvider | ethers.providers.JsonRpcSigner
) => {
  return new ethers.Contract(contractAddress, soulBoundABI, provider);
};

export const getContractMintingEvents = async (
  toWalletAddress?: string
): Promise<NftEventWithMetadata[]> => {
  const provider = getProvider();
  const contract = getContract(provider);
  const filter = contract.filters.Transfer(null, toWalletAddress); // filter for all Transfer events
  const events = await contract.queryFilter(filter);

  // get transaction hash, block number, and timestamp
  let eventsWithMetadata: NftEventWithMetadata[] = [];
  for (const event of events) {
    const transactionHash = event.transactionHash;
    const tokenId = event.args?.["tokenId"];
    const ownerWalletAddress = await contract.ownerOf(tokenId);
    const block = await provider.getBlock(event.blockNumber);

    eventsWithMetadata.push({
      timestamp: block.timestamp,
      owner_address: ownerWalletAddress,
      transaction_hash: transactionHash,
      token_id: tokenId,
      from: event.args?.from,
      to: event.args?.to,
    });
  }

  return eventsWithMetadata;
};

export const fetchTokenDetailsByWalletAddress = async (
  userAddress?: string
): Promise<NftEventWithMetadata[]> => {
  const mintedTokens = await getContractMintingEvents(userAddress);
  return mintedTokens;
};

export const verifySignature = (message: string, signature: string) => {
  const messageHash = ethers.utils.hashMessage(message);
  const signerAddress = ethers.utils.recoverAddress(messageHash, signature);
  return signerAddress.toLowerCase();
};

export const mintToken = async (
  walletAddress: string,
  signature: string,
  message: string
): Promise<NftEventWithMetadata> => {
  if (!walletAddress || !signature || !message) {
    throw new Error("Wallet address, signature and message are required");
  }

  let isValidSignature = false;
  try {
    isValidSignature =
      verifySignature(message, signature) === walletAddress.toLowerCase();
  } catch (error) {
    console.error("Error verifying signature:", error);
  }

  if (!isValidSignature) {
    throw new Error("Invalid signature");
  }

  const provider = getProvider();
  const contract = getContract(provider);

  const nonce = await provider.getTransactionCount(walletAddress);
  const gasPrice = await provider.getGasPrice();
  const gasLimit = await contract.estimateGas.safeMint(walletAddress);

  const tx = {
    to: contractAddress,
    nonce,
    gasLimit,
    gasPrice,
    data: contract.interface.encodeFunctionData("safeMint", [walletAddress]),
  };

  const signedTx = await provider.send("eth_sendRawTransaction", [tx]);
  const sentTx = await provider.sendTransaction(signedTx);
  const receipt = await sentTx.wait();
  const transactionHash = receipt.transactionHash;

  const newEvents = await getContractMintingEvents(walletAddress);
  const matchingEvent = newEvents.find(
    (event) => event.transaction_hash === transactionHash
  );

  if (!matchingEvent) {
    throw new Error("Transaction failed");
  }

  return matchingEvent;
};

export const getGasPriceEstimate = async () => {
  const provider = getProvider();
  const gasPrice = await provider.getGasPrice();
  return gasPrice;
};
