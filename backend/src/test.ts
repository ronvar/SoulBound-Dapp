import { fetchTokenDetailsByWalletAddress } from "./controllers/amoy/amoy";

export const test = async () => {
  const totalSupply = await fetchTokenDetailsByWalletAddress();

  const userTokens = await fetchTokenDetailsByWalletAddress(
    "0x754e49da4978bd9FF2e9Bfddd9399898FbB3dEc3"
  );

  console.log("tokenIds", totalSupply);
  console.log("user tokens", userTokens);
};
