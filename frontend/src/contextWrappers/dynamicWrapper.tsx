import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import dotenv from "dotenv";
import React, { useCallback, useContext } from "react";
import { AuthContext } from "./authContext";
import { useShallowEffect } from "@mantine/hooks";
dotenv.config();

const environmentId =
  process.env.DYNAMIC_ENVIRONMENT_ID || "3a0e23c3-0291-4190-a1de-d7b4fd7e4b47";

type DynamicWrapperProps = {
  children: React.ReactNode;
};

/* Handles dynamic sdk context and authentication */
const DynamicWrapper: React.FC<DynamicWrapperProps> = ({ children }) => {
  const { saveUser, signIn, signOut } = useContext(AuthContext); 

  const checkAuthAtStart = useCallback(async () => {
    const authToken = localStorage.getItem("soulBoundDappAuth");
    const authTokenSaveTime = localStorage.getItem("soulBoundDappAuthTime") as string;
    const currentTime = new Date().toISOString();

    // difference should be no more than 24 hours
    const difference = new Date(currentTime).getTime() - new Date(authTokenSaveTime).getTime();
    if (authToken && difference < 86400000) {
      try {
        await signIn(authToken);
      } catch (error) {
        console.error("Error during signIn", error);
      }
    } else {
      signOut();
    }
  }, []);


  const onAuthSuccess = useCallback(async (args: any) => {
    console.log('onAuthSuccess', args)
    const authToken = args.authToken;
    try {
      await signIn(authToken);
    } catch (error) {
      console.error("Error during signIn", error);
    }
  }, []);

  const onWalletAdded = useCallback(async (args: any) => {
    console.log('onWalletAdded', args)
    const walletAdded = args.wallet;
    const address = walletAdded.address as string;
    const authenticated = walletAdded.authenticated as boolean;

    if (authenticated) {
      try {
        await saveUser({ wallet_address: address.toLowerCase() });
      } catch (error) {
        console.error("Error during walletAdded", error);
      }
    } else {
      console.log("Wallet not authenticated");
    }
  }, [saveUser]);

  const onWalletRemoved = useCallback(async (removedWallet: any) => {
    console.log('onWalletRemoved', removedWallet)
    saveUser({ wallet_address: "" });
  }, [])

  useShallowEffect(() => {
    checkAuthAtStart();
  }, [])

  return (
    <DynamicContextProvider
      theme={"light"}
      settings={{
        environmentId: environmentId,
        walletConnectors: [EthereumWalletConnectors],
        eventsCallbacks: {
          onAuthSuccess: onAuthSuccess,
          onLinkSuccess: onWalletAdded,
          onUnlinkSuccess: onWalletRemoved,
          onLogout: signOut,
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};

export default DynamicWrapper;
