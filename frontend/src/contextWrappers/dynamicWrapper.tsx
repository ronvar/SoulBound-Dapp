
import {
  DynamicContextProvider,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import dotenv from "dotenv";
dotenv.config();


const environmentId = process.env.DYNAMIC_ENVIRONMENT_ID || "";

type DynamicWrapperProps = {
  children: React.ReactNode;
};

const DynamicWrapper: React.FC<DynamicWrapperProps> = ({ children }) => {
  return (
    <DynamicContextProvider
    theme={"light"}
      settings={{
        environmentId: "3a0e23c3-0291-4190-a1de-d7b4fd7e4b47",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};

export default DynamicWrapper;
