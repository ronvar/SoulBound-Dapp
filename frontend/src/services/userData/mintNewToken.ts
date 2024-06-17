import { NftEventWithMetadata } from "@/types/apiResponses";
import { NftDetails } from "@/types/nft";
import dappApi from "@/utils/api/fetcher";

export const mintNewToken = async (
  address: string,
): Promise<NftDetails | undefined> => {
  try {
    const body = {
      wallet_address: address,
    };
    const response = await dappApi.post<{ data: NftEventWithMetadata }>(
      `/user/mint`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const token = response.data;
    const castedToken = {
      tokenId: token.token_id.toString(),
      ownerAddress: token.owner_address,
      transactionHash: token.transaction_hash,
      to: token.to,
      from: token.from,
      timestamp: token.timestamp,
    };
    return castedToken;
  } catch (err) {
    console.error("error minting new token", err);
    return undefined;
  }
};

export const getNewMintGasPriceEstimate = async (): Promise<string> => {
  try {
    const response = await dappApi.get<{ gas_price: string }>(`/user/gasPrice`);
    return response.gas_price;
  } catch (err) {
    console.error("error getting gas price estimate", err);
    return "0";
  }
};
