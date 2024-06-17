import BigNumber from "bignumber.js";

export type NftEventWithMetadata = {
  from: string;
  to: string;
  transaction_hash: string;
  token_id: BigNumber;
  timestamp: number;
  owner_address: string;
};
