import { NftEventWithMetadata } from "@/types/apiResponses";
import { NftDetails } from "@/types/nft";
import dappApi from "@/utils/api/fetcher";

export const getMintedTokens = async (
  address?: string
): Promise<NftDetails[]> => {
  try {
    const response = await dappApi.get<{ data: NftEventWithMetadata[] }>(
      `/user/getTokens${address ? `?wallet_address=${address}` : ""}`,
    );
    const mintedTokens = response.data.map((token) => ({
      tokenId: token.token_id.toString(),
      ownerAddress: token.owner_address,
      transactionHash: token.transaction_hash,
      to: token.to,
      from: token.from,
      timestamp: token.timestamp,
    }));
    return mintedTokens;
  } catch (err) {
    console.error("error fetching minted tokens", err);
    return [];
  }
};
