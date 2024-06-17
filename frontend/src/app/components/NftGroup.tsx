import { NftDetails } from "@/types/nft";
import { Stack } from "@mantine/core";
import NftCard from "./NFTCard";

type NftGroupProps = {
  nfts: NftDetails[];
};

const NftGroup: React.FC<NftGroupProps> = ({ nfts }) => {
  return (
    <Stack w={"100%"} spacing={"md"}>
      {nfts.map((nft, idx) => (
        <NftCard
          key={`${nft.tokenId}-${idx}`}
          token={nft}
        />
      ))}
    </Stack>
  );
};

export default NftGroup;
