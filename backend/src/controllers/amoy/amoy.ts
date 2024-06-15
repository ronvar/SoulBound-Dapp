import BigNumber from "bignumber.js";
import { ethers, JsonRpcProvider } from "ethers";

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
  return new JsonRpcProvider(amoyTestnetRpcUrl);
};

export const getContract = (provider: ethers.JsonRpcApiProvider) => {
  return new ethers.Contract(contractAddress, soulBoundABI, provider);
};

export const fetchTokenURI = async (
  contract: ethers.Contract,
  tokenId: number | BigNumber
) => {
  const tokenURI = await contract.tokenURI(tokenId);
  return tokenURI;
};

export const fetchTokenIds = async (
  contract: ethers.Contract,
  userAddress?: string
) => {
  const filter = contract.filters.Transfer(null, userAddress); // filter for all Transfer events
  const events = await contract.queryFilter(filter);

  // Extract tokenId from event args
  const tokenIds = events
    .map((event) => {
      const eventLog = event as ethers.EventLog;
      const tokenId =
        eventLog.args && (eventLog.args[2] as BigNumber) >= new BigNumber(0)
          ? (eventLog.args[2] as BigNumber)
          : null;
      return tokenId;
    })
    .filter((tokenId) => tokenId !== null); // Filter out any null values
  return [...new Set(tokenIds)]; // remove duplicates in case of transfers
};
