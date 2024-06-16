import { Request, Response } from "express";
import { fetchTokenDetailsByWalletAddress } from "../amoy/amoy";

export const getMintedNFTsConroller = async (
    req: Request,
    res: Response<any, Record<string, any>>
  ): Promise<Response<any, Record<string, any>>> => {
    const userWalletAddress = req.body.wallet_address || undefined;
    console.log('body', req.body)
  
    const mintedNFTs = await fetchTokenDetailsByWalletAddress(
        userWalletAddress
    );
    const payload = {
      data: mintedNFTs,
    };

    return res.status(200).json(payload);
  };