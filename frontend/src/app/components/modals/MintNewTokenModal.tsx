import useMintedTokens from "@/hooks/useMintedTokens";
import { getNewMintGasPriceEstimate } from "@/services/userData/mintNewToken";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

type MintNewTokenModalProps = {
  opened: boolean;
  close: () => void;
};

const MintNewTokenModal: React.FC<MintNewTokenModalProps> = ({
  opened,
  close,
}) => {
  const { mintToken } = useMintedTokens();
  const [processing, setProcessing] = useState<boolean>(false);
  const [gasPrice, setGasPrice] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const onMintToken = useCallback(async () => {
    if (processing) return;

    setError(false);
    setProcessing(true);
    console.log("Minting new token");
    const newToken = await mintToken();
    if (!newToken) {
      setError(true);
    } else {
      close();
    }
    setProcessing(false);
  }, [processing, mintToken, close]);

  const refreshGasPrice = useCallback(async () => {
    const newGasPrice = await getNewMintGasPriceEstimate();
    setGasPrice(newGasPrice);
  }, []);

  useEffect(() => {
    if (opened) {
      refreshGasPrice();
    }
  }, [opened, refreshGasPrice]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Mint a New Token"
      size={500}
      radius={12}
      centered
    >
      {!gasPrice && (
        <Text align="center" size="lg">
          Loading gas price estimate...
        </Text>
      )}
      {!!gasPrice && (
        <Group position="center">
          <Text size="lg">
            You are about to mint a new token. This action will cost you{" "}
            {gasPrice} gwei.
          </Text>
          <Button onClick={refreshGasPrice} color="blue">
            Refresh Gas Estimate
          </Button>
        </Group>
      )}

      <Group position="right" spacing={12} pt={16}>
        <Button onClick={close} color="gray" disabled={!gasPrice}>
          Cancel
        </Button>
        <Button onClick={onMintToken} color="blue" disabled={!gasPrice}>
          {processing ? "Processing..." : "Mint Token"}
        </Button>
      </Group>
    </Modal>
  );
};

export default MintNewTokenModal;
