import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

type DynamicWrapperProps = {
    children: React.ReactNode;
    };

const DynamicWrapper: React.FC<DynamicWrapperProps> = ({
    children,
}) => (
  <DynamicContextProvider
    settings={{
      environmentId: '3a0e23c3-0291-4190-a1de-d7b4fd7e4b47',
      walletConnectors: [ EthereumWalletConnectors ],
    }}>
    <DynamicWidget />
    {children}
  </DynamicContextProvider>
);

export default DynamicWrapper;
