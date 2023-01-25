import { SignClientTypes } from '@walletconnect/types'
import { getSdkError } from '@walletconnect/utils'

// TODO: fix the line break of the sign in message
export const signInMessage =
  "Welcome to frens!\n\nYou are one step away from investing cryptocurrencies with your friends.\n\nClick to sign in and accept the frens Terms of Service\n\nThis request will not trigger a blockchain transaction or cost any gas fees.";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { getChainData } from "./chains";
import { getSignParamsMessage, getSignTypedDataParamsData } from './HelperUtil';

interface IHolderBalanceInfo {
  balance: BigNumber;
  // power: BigNumber;
  // share: { tokenAddress: string | undefined; value: BigNumber }[];
}

interface ITransferEvent {
  transaction_hash: string;
  address: string;
  block_timestamp: string;
  block_number: string;
  block_hash: string;
  to_address: string;
  from_address: string;
  value: string;
  transaction_index: number;
  log_index: number;
}

// Types of ETH signing methods supported by WalletConnect
export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction'
}

// function to verfiy signature with user address
export function verifyAddress(sig: string, address: string): boolean {
  const recoveredAddress = ethers.utils.verifyMessage(signInMessage, sig);
  if (address === recoveredAddress) {
    return true;
  } else {
    return false;
  }
}

// initilaize a wallet given mnemonic, and connect to infura node
export function initWallet(mnemonic: string) {
  let wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const rpcUrl = getChainData(
    parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!)
  ).rpc_url;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  wallet = wallet.connect(provider);
  return wallet;
}

export function getPk(wallet: ethers.Wallet) {
  return wallet.privateKey;
}

// utility function to send transaction from a wallet
export async function sendTransaction(transaction: any, wallet: ethers.Wallet) {
  if (wallet) {
    if (
      transaction.from &&
      transaction.from.toLowerCase() !== wallet.address.toLowerCase()
    ) {
      console.error("Transaction request From doesn't match active account");
    }

    if (transaction.from) {
      delete transaction.from;
    }

    // ethers.js expects gasLimit instead
    if ("gas" in transaction) {
      transaction.gasLimit = transaction.gas;
      delete transaction.gas;
    }

    const result = await wallet.sendTransaction(transaction);
    return result.hash;
  } else {
    console.error("No Active Account");
  }
  return null;
}

// Get all the token addresses that the user has
export async function getUserHoldings(userAddress: string): Promise<string[]> {
  const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_KEY;
  const tokensOptions = {
    method: "GET",
    url: "https://deep-index.moralis.io/api/v2/%address%/erc20".replace(
      "%address%",
      userAddress
    ),
    params: {
      chain: getChainData(parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!))
        .network,
    },
    headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
  };
  const erc20Tokens: any[] = await axios
    .request(tokensOptions)
    .then((response) => {
      return response.data;
    })
    .then((data) => data.map((token: any) => token.token_address));
  return erc20Tokens;
}

// Return a boolean value if the user's wallet holds a specific club token
export async function verifyClubHolding(
  userAddress: string,
  clubTokenAddress: string
): Promise<boolean> {
  // console.log(userAddress, clubTokenAddress)
  const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_KEY;
  const options = {
    method: "GET",
    url: "https://deep-index.moralis.io/api/v2/%address%/erc20".replace(
      "%address%",
      userAddress
    ),
    params: {
      chain: getChainData(parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!))
        .network,
      token_addresses: clubTokenAddress,
    },
    headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
  };
  try {
    const result = await axios
      .request(options)
      .then((response) => response.data);
    // console.log(result)
    if (result.length !== 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Returns USD price of the token
export async function getUsdPrice(tokenAddress?: string): Promise<number> {
  const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_KEY;
  let usdPrice = 0;
  const options = {
    method: "GET",
    url: "https://deep-index.moralis.io/api/v2/erc20/%address%/price".replace(
      "%address%",
      tokenAddress!
    ),
    params: {
      chain: getChainData(parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!))
        .network,
    },
    headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
  };
  try {
    if (tokenAddress) {
      const result = await axios
        .request(options)
        .then((response) => response.data);
      if (result.usdPrice) {
        usdPrice = result.usdPrice;
      }
    } else {
      usdPrice = await axios
        .get(
          "https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=USD"
        )
        .then((response) => response.data)
        .then((data) => data.ETH.USD);
    }
  } catch (err) {
    console.log("Fetch usd price error: ", err);
  }
  return usdPrice;
}

