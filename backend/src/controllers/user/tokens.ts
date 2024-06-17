import { Request, Response } from "express";
import { fetchTokenDetailsByWalletAddress, getGasPriceEstimate, mintToken } from "../amoy/amoy";

export const getMintedNFTsConroller = async (
  req: Request,
  res: Response<any, Record<string, any>>
): Promise<Response<any, Record<string, any>>> => {
  const userWalletAddress = req.query.wallet_address as string || undefined;
  const mintedNFTs = await fetchTokenDetailsByWalletAddress(userWalletAddress);
  const payload = {
    data: mintedNFTs.map((nft) => ({
      // token_id returns as a hex string
      token_id: nft.tokenId.toString(),
      owner_address: nft.ownerAddress,
      transaction_hash: nft.transactionHash,
      to: nft.to,
      from: nft.from,
      timestamp: nft.timestamp,
    })),
  };

  return res.status(200).json(payload);
};

export const mintNewNFTConroller = async (
  req: Request,
  res: Response<any, Record<string, any>>
): Promise<Response<any, Record<string, any>>> => {
  const userWalletAddress = req.body.wallet_address as string || undefined;
  const userMessage = req.body.message as string || undefined;
  const userSignature = req.body.signature as string || undefined;

  console.log('body', req.body);

  if (!userWalletAddress || !userMessage || !userSignature) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const nft = await mintToken(userWalletAddress, userSignature, userMessage);
  const payload = {
    data: {
      // token_id returns as a hex string
      token_id: nft.tokenId.toString(),
      owner_address: nft.ownerAddress,
      transaction_hash: nft.transactionHash,
      to: nft.to,
      from: nft.from,
      timestamp: nft.timestamp,
    }
  };

  return res.status(200).json(payload);
};

export const getMintingGasPriceController = async (
  req: Request,
  res: Response<any, Record<string, any>>
): Promise<Response<any, Record<string, any>>> => {
  const estimatedGasPrice = await getGasPriceEstimate();
  const payload = {
    gas_price: estimatedGasPrice.toString()
  };

  return res.status(200).json(payload);
}
