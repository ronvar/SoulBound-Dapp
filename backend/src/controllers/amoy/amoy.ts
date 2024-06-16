import BigNumber from "bignumber.js";
import { ethers } from "ethers";

const soulBoundABI = require("./soulbound.json");
const contractAddress = "0xA57CC3065E049d50D4f2D10F614FCfA6A8CA8eb5";
const amoyTestnetRpcUrl = "https://rpc-amoy.polygon.technology";

export type NftEventWithMetadata = {
  from: string;
  to: string;
  transactionHash: string;
  tokenId: BigNumber;
  timestamp: number;
  ownerAddress: string;
};

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

export const getContractMintingEvents = async (toWalletAddress?: string): Promise<
  NftEventWithMetadata[]
> => {
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
      ownerAddress: ownerWalletAddress,
      transactionHash,
      tokenId,
      from: event.args?.from,
      to: event.args?.to,
    });
  }

  console.log("eventsWithMetadata", eventsWithMetadata)
  return eventsWithMetadata;
};

export const fetchTokenDetailsByWalletAddress = async (
  userAddress?: string
): Promise<BigNumber[]> => {
  // Extract tokenId from event args
  const mintedTokens = await getContractMintingEvents(userAddress);
  const tokenIds = mintedTokens
    .map((tokens) => tokens.tokenId)
    .filter((tokenId) => tokenId !== null); // Filter out any null values
  return [...new Set(tokenIds)] as BigNumber[]; // remove duplicates in case of transfers
};

export const mintToken = async (
  walletAddress: string,
  signature: string,
  message: string
) => {
  if (!walletAddress || !signature || !message) {
    throw new Error("Wallet address, signature and message are required");
  }

  const isValidSignature =
    ethers.utils.verifyMessage(message, signature) ===
    walletAddress.toLowerCase();

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

  // Extract tokenId from event args in the receipt
  const event = receipt.logs
    .map((log) => contract.interface.parseLog(log))
    .find(
      (parsedLog) =>
        parsedLog.name === "Transfer" &&
        parsedLog.args.to.toLowerCase() === walletAddress.toLowerCase()
    );

  const tokenId = event ? (event.args?.[2] as BigNumber).toNumber() : null;
  const transactionHash = receipt.transactionHash;
  const gasUsed = receipt.gasUsed;
  return { tokenId, transactionHash, gasUsed };
};
