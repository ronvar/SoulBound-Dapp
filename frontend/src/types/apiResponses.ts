import { ChainId } from "./chains";
import { SimpleHashNFTResponse } from "./simplehash";

export type MintedTokensResponse = {
    wallet_ddress: string,
    chain_id: ChainId,
    tokens: SimpleHashNFTResponse[] | null,
  }