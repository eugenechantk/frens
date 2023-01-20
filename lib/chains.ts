import { IChainData } from "./types/ethereum";

// return the Infura node rpcUrl for a chain given the env variable
export function getChainData(chainId: number): IChainData {
  const chainData = SUPPORTED_CHAINS.filter(
    (chain: any) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    throw new Error("ChainId missing or not supported");
  }

  const API_KEY = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

  if (!API_KEY) {
    throw new Error(
      "Environment variable NEXT_PUBLIC_INFURA_PROJECT_ID is not set"
    );
  }

  if (
    chainData.rpc_url.includes("infura.io") &&
    chainData.rpc_url.includes("%API_KEY%") &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl,
    };
  }

  return chainData;
}

export const SUPPORTED_CHAINS: IChainData[] = [
  {
    name: "Ethereum Mainnet",
    short_name: "eth",
    chain: "ETH",
    network: "eth",
    chain_id: 1,
    network_id: 1,
    rpc_url: "https://mainnet.infura.io/v3/%API_KEY%",
    native_currency: {
      symbol: "ETH",
      name: "Ether",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
  {
    name: "Ethereum Görli",
    short_name: "gor",
    chain: "ETH",
    network: "goerli",
    chain_id: 5,
    network_id: 5,
    rpc_url: "https://goerli.infura.io/v3/%API_KEY%",
    native_currency: {
      symbol: "ETH",
      name: "Ether",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
];