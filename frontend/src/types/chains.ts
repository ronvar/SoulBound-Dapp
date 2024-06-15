export interface ChainIds {
    [key: string]: ChainId;
  }
  
  export type ChainId =
    | "1"
    | "137"
    | "10"
    | "8453"
    | "7777777"
    | "59144"
    | "poap"
    | "42161"
    | "80085"
    | "80001"
    | "11155111"
    | "5000"
    | "34443"
    | "10242"
    | "167008"
    | "324"
    | "farcaster"
    | "lens";
  
  export type Chain = {
    name: string;
    value: string;
    id: ChainId;
  };
  
  export type ChainSearchResultData = {
    [key in ChainId]: any;
  };
  
  export const Chains: Record<string, Chain> = {
    Ethereum: {
      name: "Ethereum",
      value: "ethereum",
      id: "1",
    },
    Polygon: {
      name: "Polygon",
      value: "polygon",
      id: "137",
    },
    Optimism: {
      name: "Optimism",
      value: "optimism-mainnet",
      id: "10",
    },
    Base: {
      name: "Base",
      value: "base-mainnet",
      id: "8453",
    },
    Zora: {
      name: "Zora",
      value: "zora-mainnet",
      id: "7777777",
    },
    Linea: {
      name: "Linea",
      value: "poap",
      id: "59144",
    },
    Poap: {
      name: "POAP",
      value: "poap",
      id: "poap",
    },
    ZKSync: {
      name: "ZKSync",
      value: "zksync-era",
      id: "324",
    },
    Lens: {
      name: "Lens",
      value: "lens",
      id: "lens",
    },
    Farcaster: {
      name: "Farcaster",
      value: "farcaster",
      id: "farcaster",
    },
  };
  
  export function findChainNameById(chainId: string): string | undefined {
    for (const key in Chains) {
      if (Chains[key].id === chainId) {
        return Chains[key].name;
      }
    }
    return undefined; // return undefined if no matching id is found
  }
  
  export function findChainValueById(chainId: string): string | undefined {
    for (const key in Chains) {
      if (Chains[key].id === chainId) {
        return Chains[key].value;
      }
    }
    return undefined; // return undefined if no matching id is found
  }
  