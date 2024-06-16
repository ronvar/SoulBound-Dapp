import { useDynamicModals } from "@dynamic-labs/sdk-react-core";
import { Button, Text } from "@mantine/core";
import { useCallback } from "react";

export const LinkWalletButton = () => {
  const { setShowLinkNewWalletModal } = useDynamicModals();

  const handleConnectWalletClick = useCallback(() => {
    setShowLinkNewWalletModal(true);
  }, [setShowLinkNewWalletModal]);
  return (
    <Button h={32} px={8} onClick={handleConnectWalletClick}>
      <Text fz="sm" weight={400} color={"white"}>
        Connect Wallet
      </Text>
    </Button>
  );
};
