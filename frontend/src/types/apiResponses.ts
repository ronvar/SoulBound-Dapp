export type NftEventWithMetadata = {
    from: string;
    to: string;
    transaction_hash: string;
    token_id: string;
    timestamp: number;
    owner_address: string;
  };

export type MintedTokensResponse = {
    wallet_ddress: string,
    tokens: NftEventWithMetadata[],
  }