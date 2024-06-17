import { Box, Stack, Text, Image, createStyles } from "@mantine/core";
import React from "react";
import useScreenSize from "../../hooks/useScreenSize";
import { NftDetails } from "@/types/nft";

const DEFAULT_BANNER =
  "https://www.foodandwine.com/thmb/vniCoVMHXbMOsPRejymc8ZNY5OU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/food-nft-FT-BLOG1021-1-930fc9cf208947a4a82331bf3f2868af.jpg";
const useStyles = createStyles((theme) => {
  let backgroundColor = "#EEEEEE";

  return {
    cardContainer: {
      position: "relative",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing.md,
      gap: theme.spacing.md,
      flex: "1 1 0",
      alignItems: "flex-start",
      minWidth: 150,
      borderRadius: theme.radius.md,
      border: `1px solid #ABABAB`,
      backgroundColor,
      transition: `all 0.15s ease-in-out`,
    },
    imageContainer: {
      height: 130,
      width: "100%",
      overflow: "hidden",
      display: "flex",
      position: "relative",
    },
    image: {
      borderRadius: theme.radius.md,
      objectFit: "cover",
    },
    actionIconContainer: {
      color: theme.fn.primaryColor(),
    },
  };
});

type CollectionCardProps = {
  token: NftDetails;
};
const NftCard: React.FC<CollectionCardProps> = ({
  token
}) => {
  const { classes } = useStyles();
  const dateString = new Date(token.timestamp * 1000).toDateString();

  return (
    <Box className={classes.cardContainer}>
      <Box className={classes.imageContainer}>
        <Image
          className={classes.image}
          draggable={false}
          src={DEFAULT_BANNER}
          alt={`banner`}
          w={"100%"}
          fit="cover"
        />
      </Box>
      <Stack
        w={"100%"}
        style={{
          flexGrow: 1,
        }}
        spacing={0}
      >
        <Text variant="primary" weight={700} truncate>
          Token ID: <Text weight={400} span>{token.tokenId}</Text>
        </Text>
        <Text variant="primary" fz="sm" truncate>
          Txn Hash: {token.transactionHash}
        </Text>
        <Text variant="primary" fz="sm" truncate>
          Owner Address: {token.ownerAddress}
        </Text>
        <Text variant="primary" fz="sm" truncate>
          Minted: {dateString}
        </Text>
      </Stack>
    </Box>
  );
};

export default NftCard;
