import BigNumber from "bignumber.js";

export type NftEventWithMetadata = {
    from: string;
    to: string;
    transactionHash: string;
    tokenId: BigNumber;
    timestamp: number;
    ownerAddress: string;
  };