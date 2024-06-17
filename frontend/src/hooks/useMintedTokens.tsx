import { allMintedNftsAtom, userMintedNftsAtom } from "@/atoms/userAtoms";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { AuthContext } from "@/contextWrappers/authContext";
import { getMintedTokens } from "@/services/userData/mintedTokens";
import { useShallowEffect } from "@mantine/hooks";
import { useAtom } from "jotai";
import isEqual from "lodash.isequal";
import { useCallback, useContext, useEffect, useState } from "react";
import { mintNewToken } from "@/services/userData/mintNewToken";

/* Handles fetching minted tokens and minting new tokens
 * @param fetchData - if true, fetches data from the server
 */
const useMintedTokens = (fetchData?: boolean) => {
  const { primaryWallet } = useDynamicContext();
  const { user, authenticated } = useContext(AuthContext);
  const [mintedTokens, setMintedTokens] = useAtom(allMintedNftsAtom);
  const [userMintedTokens, setUserMintedTokens] = useAtom(userMintedNftsAtom);
  const [loadingAllMintedTokens, setLoadingAllMintedTokens] = useState(false);
  const [loadingUserMintedTokens, setLoadingUserMintedTokens] = useState(false);
  const [error, setError] = useState<any>(null);
  const isLoggedIn = useIsLoggedIn();

  const getSignature = async (): Promise<{
    message: string;
    signature: string;
  }> => {
    if (!primaryWallet) {
      throw new Error("No wallet connected");
    }

    // Signing a message
    const message = "purchase new token " + Date.now();
    const signature = await primaryWallet.connector.signMessage(message);

    if (!signature) {
      throw new Error("No signature returned");
    }

    console.log('got signature', signature)
    return { message, signature };
  };

  const mintToken = useCallback(async () => {
    //
    if (authenticated && user?.wallet_address && primaryWallet) {
      try {
        const newToken = await mintNewToken(
          user.wallet_address,
        );

        if (newToken?.to.toLowerCase() === user.wallet_address.toLowerCase()) {
          fetchUserMintedTokens(true);
        } else {
          console.error("Token minted but not sent to user");
        }

        return newToken;
      } catch (error: any) {
        setError(error);
      }
    } else {
      console.error("User not authenticated or no wallet address", {
        authenticated,
        user,
        primaryWallet,
      });
    }
  }, [authenticated, user, primaryWallet, setUserMintedTokens]);

  const fetchMintedTokens = useCallback(
    async (forceUpdate?: boolean) => {
      if ((loadingAllMintedTokens || !fetchData) && !forceUpdate) return;
      try {
        setLoadingAllMintedTokens(true);
        const newMintedTokens = await getMintedTokens();
        if (!isEqual(newMintedTokens, mintedTokens))
          setMintedTokens(newMintedTokens);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoadingAllMintedTokens(false);
      }
    },
    [fetchData, loadingAllMintedTokens, mintedTokens, setMintedTokens]
  );

  const fetchUserMintedTokens = useCallback(
    async (forceUpdate?: boolean) => {
      if ((loadingUserMintedTokens || !fetchData) && !forceUpdate) return;
      if (authenticated && user?.wallet_address) {
        try {
          setLoadingUserMintedTokens(true);
          const newUserMintedTokens = await getMintedTokens(
            user.wallet_address
          );
          if (!isEqual(userMintedTokens, newUserMintedTokens))
            setUserMintedTokens(newUserMintedTokens);
        } catch (error: any) {
          setError(error);
        } finally {
          setLoadingUserMintedTokens(false);
        }
      }
    },
    [
      fetchData,
      authenticated,
      loadingUserMintedTokens,
      setUserMintedTokens,
      user,
      userMintedTokens,
    ]
  );

  // fetch all minted tokens at page load
  useShallowEffect(() => {
    fetchMintedTokens();
  }, []);

  // fetch user minted tokens if user is authenticated and has a wallet address
  useEffect(() => {
    fetchUserMintedTokens();
  }, [user, authenticated]);

  return {
    error,
    mintedTokens,
    userMintedTokens,
    loadingUserMintedTokens,
    loadingAllMintedTokens,
    mintToken,
    fetchMintedTokens,
    fetchUserMintedTokens,
  };
};

export default useMintedTokens;
