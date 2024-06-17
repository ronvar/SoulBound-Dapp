import useMintedTokens from "@/hooks/useMintedTokens";
import { Box, Button, Center, Group, Loader, Text } from "@mantine/core";
import NftGroup from "./NftGroup";
import { useCallback, useContext, useEffect, useState } from "react";
import { NftDetails } from "@/types/nft";
import { AuthContext } from "@/contextWrappers/authContext";
import MintNewTokenModal from "./modals/MintNewTokenModal";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

type NftsSectionProps = {
  type: "all" | "user";
};

export const NftsSection: React.FC<NftsSectionProps> = ({ type }) => {
  const { user } = useContext(AuthContext);
  const {
    mintedTokens,
    userMintedTokens,
    loadingAllMintedTokens,
    loadingUserMintedTokens,
  } = useMintedTokens();
  const { primaryWallet, isAuthenticated, setShowLinkNewWalletModal, setShowAuthFlow } =
    useDynamicContext();
  const { fetchMintedTokens, fetchUserMintedTokens } = useMintedTokens();
  const [refreshingData, setRefreshingData] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<NftDetails[]>(
    type === "all" ? mintedTokens : userMintedTokens
  );
  const [loadingSelectedTokens, setLoadingSelectedTokens] = useState<boolean>(
    type === "all" ? loadingAllMintedTokens : loadingUserMintedTokens
  );
  const [mintNewNftModalOpened, setMintNewNftModalOpened] = useState(false);

  useEffect(() => {
    setSelectedTokens(type === "all" ? mintedTokens : userMintedTokens);
    setLoadingSelectedTokens(
      type === "all" ? loadingAllMintedTokens : loadingUserMintedTokens
    );
  }, [
    type,
    loadingAllMintedTokens,
    loadingUserMintedTokens,
    mintedTokens,
    userMintedTokens,
  ]);

  const onRefreshClick = useCallback(async () => {
    setRefreshingData(true);
    if (type === "all") await fetchMintedTokens(true);
    else await fetchUserMintedTokens(true);

    setRefreshingData(false);
  }, [type]);

  const onMintNewNftClick = useCallback(() => {
    setMintNewNftModalOpened(true);
  }, []);

  const onConnectNewWallet = useCallback(() => {
    setShowLinkNewWalletModal(true);
  }, [setShowLinkNewWalletModal]);

  return (
    <Box w={"100%"}>
      {type === "user" && (
        <MintNewTokenModal
          opened={mintNewNftModalOpened}
          close={setMintNewNftModalOpened.bind(this, false)}
        />
      )}
      <Center>
        <Text fz={40} weight={700}>{`${
          type === "all" ? "All" : "My"
        } Minted NFTs`}</Text>
      </Center>
      <Group position="right" py={16}>
        {isAuthenticated && !primaryWallet && (
          <Button onClick={onConnectNewWallet} h={40}>
            Connect Wallet
          </Button>
        )}
        {type === "user" && !!user?.wallet_address && (
          <Button onClick={onMintNewNftClick} h={40}>
            Mint New NFT
          </Button>
        )}
        <Button
          onClick={onRefreshClick}
          h={40}
          disabled={refreshingData}
          loading={refreshingData}
        >
          Refesh Data
        </Button>
      </Group>
      <Center>
        {loadingSelectedTokens && <Loader size={60} />}
        {!loadingSelectedTokens && selectedTokens.length > 0 && (
          <NftGroup nfts={selectedTokens} />
        )}
        {!loadingSelectedTokens && selectedTokens.length === 0 && (
          <Text fz={"xl"} weight={700}>
            {`No ${type === "user" ? "user " : ""}minted tokens`}
          </Text>
        )}
      </Center>
    </Box>
  );
};

export default NftsSection;
