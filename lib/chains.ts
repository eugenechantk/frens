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

export type TEIP155Chain = keyof typeof EIP155_CHAINS

export const EIP155_MAINNET_CHAINS = {
  'eip155:1': {
    chainId: 1,
    name: 'Ethereum',
    logo: '/chain-logos/eip155-1.png',
    rgb: '99, 125, 234',
    rpc: 'https://cloudflare-eth.com/'
  },
  'eip155:43114': {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    logo: '/chain-logos/eip155-43113.png',
    rgb: '232, 65, 66',
    rpc: 'https://api.avax.network/ext/bc/C/rpc'
  },
  'eip155:137': {
    chainId: 137,
    name: 'Polygon',
    logo: '/chain-logos/eip155-137.png',
    rgb: '130, 71, 229',
    rpc: 'https://polygon-rpc.com/'
  },
  'eip155:10': {
    chainId: 10,
    name: 'Optimism',
    logo: '/chain-logos/eip155-10.png',
    rgb: '235, 0, 25',
    rpc: 'https://mainnet.optimism.io'
  }
}

export const EIP155_TEST_CHAINS = {
  'eip155:5': {
    chainId: 5,
    name: 'Ethereum Goerli',
    logo: '/chain-logos/eip155-1.png',
    rgb: '99, 125, 234',
    rpc: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
  },
  'eip155:43113': {
    chainId: 43113,
    name: 'Avalanche Fuji',
    logo: '/chain-logos/eip155-43113.png',
    rgb: '232, 65, 66',
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc'
  },
  'eip155:80001': {
    chainId: 80001,
    name: 'Polygon Mumbai',
    logo: '/chain-logos/eip155-137.png',
    rgb: '130, 71, 229',
    rpc: 'https://matic-mumbai.chainstacklabs.com'
  },
  'eip155:420': {
    chainId: 420,
    name: 'Optimism Goerli',
    logo: '/chain-logos/eip155-10.png',
    rgb: '235, 0, 25',
    rpc: 'https://goerli.optimism.io'
  }
}

export const EIP155_CHAINS = { ...EIP155_MAINNET_CHAINS, ...EIP155_TEST_CHAINS }