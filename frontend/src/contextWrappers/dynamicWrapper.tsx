import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { useAtom } from "jotai";
import {
  linkNewWalletModalCanceledAtom,
  linkNewWalletModalOpenAtom,
} from "@/atoms/authAtoms";
import { useCallback } from "react";

const environmentId = process.env.DYNAMIC_ENVIRONMENT_ID || "";

type DynamicWrapperProps = {
  children: React.ReactNode;
};

const DynamicWrapper: React.FC<DynamicWrapperProps> = ({ children }) => {
  const [, setLinkNewWalletModalOpen] = useAtom(linkNewWalletModalOpenAtom);
  const [, setLinkNewWalletModalCanceled] = useAtom(
    linkNewWalletModalCanceledAtom
  );
  const onAuthSuccess = useCallback(
    async (args: any) => {
      const authToken = args.authToken;
      const signInMethod =
        !args?.primaryWallet && args?.user?.email ? "email" : "wallet";
      const walletProviderName =
        signInMethod === "wallet"
          ? args?.primaryWallet?.connector?.name || ""
          : "";
      const ensAvatar = args?.user?.ens?.avatar;
      const logInData = {
        loginMethodUsed: signInMethod,
        walletProviderName: walletProviderName,
        ensAvatar: ensAvatar || "",
      };
      try {
        await signIn(authToken, logInData);
      } catch (error) {
        console.error("Error during signIn", error);
      }
    },
    [signIn]
  );

  const onLinkNewWalletModalOpenedOrClosed = useCallback(
    (opened: boolean) => {
      setLinkNewWalletModalOpen(opened);
    },
    [setLinkNewWalletModalOpen]
  );

  const onLinkNewWalletModalCanceled = useCallback(() => {
    setLinkNewWalletModalCanceled(true);
  }, [setLinkNewWalletModalCanceled]);

  const onLogout = useCallback(() => {
    setLinkNewWalletModalCanceled(false);
    signOut();
  }, [setLinkNewWalletModalCanceled, signOut]);

  return (
    <DynamicContextProvider
      settings={{
        environmentId: environmentId,
        walletConnectors: [EthereumWalletConnectors],
        appName: "Soulbound Dapp",
        events: {
          onAuthSuccess,
          onLogout,
          onAuthFlowCancel: onLinkNewWalletModalCanceled,
          onAuthFlowOpen: onLinkNewWalletModalOpenedOrClosed.bind(this, true),
          onAuthFlowClose: onLinkNewWalletModalOpenedOrClosed.bind(this, false),
        },
      }}
    >
      <DynamicWidget />
      {children}
    </DynamicContextProvider>
  );
};

export default DynamicWrapper;
