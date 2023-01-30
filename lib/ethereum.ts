import { SignClientTypes } from '@walletconnect/types'
import { getSdkError } from '@walletconnect/utils'
import axios from "axios";
import { BigNumber, ethers, Wallet } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import _ from "lodash";
import { IClubInfo } from "../pages/clubs/[id]";
import { abi } from "./abi";
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

// TODO: fix the line break of the sign in message
export const signInMessage =
  "Welcome to frens!\n\nYou are one step away from investing cryptocurrencies with your friends.\n\nClick to sign in and accept the frens Terms of Service\n\nThis request will not trigger a blockchain transaction or cost any gas fees.";

export interface IClubMemberBalance {
  [member_address: string]: number;
}

export interface IHoldingsData {
  token_address: string;
  name: string;
  symbol: string;
  logo: string | null;
  thumbnail: string | null;
  decimals: number;
  balance: string;
  value?: number;
};

// Get the latest block number, using the INFURA rpc node
export async function getLatestBlockNumber() {
  // STEP 2: Get the transfer events ellapsed from last time the club is retrieved
  const rpcUrl = getChainData(
    parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!)
  ).rpc_url;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const currentBlock = await provider.getBlockNumber();
  return currentBlock;
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
  let verified = false;
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
    console.log(result)
    if (result.length !== 0) {
      verified = true
    } else {
      verified = false
    }
  } catch (err) {
    console.log(err);
    verified = false
  }
  return verified
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

// Get member's club token balance
export async function getClubMemberBalance (clubInfo: IClubInfo, id: string) {
  // STEP 1: Fetch the last updated club member list
  let _club_members: IClubMemberBalance;
  if (clubInfo.club_members) {
    _club_members = clubInfo.club_members;
  } else {
    _club_members = {
      "0x0000000000000000000000000000000000000000": 0,
    };
  }

  // STEP 2: Get the transfer events ellapsed from last time the club is retrieved
  const rpcUrl = getChainData(
    parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!)
  ).rpc_url;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const currentBlock = await provider
    .getBlockNumber();
  // console.log(`Querying transactions from ${clubInfo.last_retrieved_block} to ${currentBlock}`);
  const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_KEY;
  const options = {
    method: "GET",
    url: "https://deep-index.moralis.io/api/v2/erc20/%address%/transfers".replace(
      "%address%",
      clubInfo.club_token_address!
    ),
    params: {
      chain: getChainData(parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!))
        .network,
      from_block:
        clubInfo.last_retrieved_block && clubInfo.last_retrieved_block,
      to_block: currentBlock,
    },
    headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
  };

  // STEP 3: Update the club member list based on new transfer events
  const transferEvents = await axios
    .request(options)
    .then((response) => response.data)
    .then((data) => data.result);
  // console.log(transferEvents);
  transferEvents.forEach((event: ITransferEvent) => {
    // Create a new member object if the existing club member object does not have the addresses
    if (!(event.from_address in _club_members)) {
      _club_members[event.from_address] = 0;
    }
    if (!(event.to_address in _club_members)) {
      _club_members[event.to_address] = 0;
    }
    // Update the balance of each club member
    _club_members[event.from_address] -= parseInt(event.value);
    _club_members[event.to_address] += parseInt(event.value);
  });
  // Purge all addresses with <=0 balance
  _club_members = _.pickBy(_club_members, function (value) {
    return value > 0;
  });
  // console.log('New club member list: ', _club_members)
  return _club_members
}

// To calculate the claim power of each member
export const getClaimPower = (clubInfo: IClubInfo, _club_members: IClubMemberBalance) => {
  const totalSupply = Object.values(_club_members).reduce(
    (sum, cur) => (sum += cur)
  );
  let _holderPower: {address: string, sharesBps: number}[] = [];
  Object.keys(_club_members).forEach((member) => {
    _holderPower.push({address: member, sharesBps: ((_club_members[member] / totalSupply)*10000)|0});
  });
  const memberClaimPower = _holderPower.reduce((acc, holder) => {return acc += holder.sharesBps},0)
  _holderPower.push({address: clubInfo.club_wallet_address!, sharesBps: 10000 - memberClaimPower})
  return _holderPower
};

// Fetch all the assets of an address
export const fetchPortfolio = async (address: string) => {
  let balances = [] as IHoldingsData[];
  const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_KEY;
  const tokensOptions = {
    method: "GET",
    url: "https://deep-index.moralis.io/api/v2/%address%/erc20".replace(
      "%address%",
      address
    ),
    params: {
      chain: getChainData(parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!))
        .network,
    },
    headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
  };

  const nativeOptions = {
    method: "GET",
    url: "https://deep-index.moralis.io/api/v2/%address%/balance".replace(
      "%address%",
      address
    ),
    params: {
      chain: getChainData(parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!))
        .network,
    },
    headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
  };

  try {
    const erc20TokenBalance = async () => {
      await axios
        .request(tokensOptions)
        .then((response) => {
          return response.data;
        })
        .then((data: []) =>
          data.forEach((tokenBalance) => balances.push(tokenBalance))
        );
    };
    const nativeBalance = async () => {
      const _nativeBalance = await axios
        .request(nativeOptions)
        .then((response) => {
          return response.data.balance;
        });
      balances.push({
        token_address: "",
        name: "Ethereum",
        symbol: "ETH",
        logo: null,
        thumbnail: null,
        decimals: 18,
        balance: String(_nativeBalance),
      });
    };
    await erc20TokenBalance().then(async () => await nativeBalance())
    return balances;
  } catch (err) {
    throw err;
  }
};

// Send specific token to split contract
export const sendToken = async (
  to_address: string,
  clubWallet: Wallet,
  send_token_amount?: string,
  contract_address?: string,
  _gasForDistribute?: number,
) => {
  let wallet = clubWallet
  let send_abi = abi;
  let send_account = wallet.getAddress();
  // Base ethereum transfer gas of 21000 + contract execution gas (usually total up to 27xxx)
  const _gasLimit = ethers.utils.hexlify(50000);

  const currentGasPrice = await wallet.provider.getGasPrice();
  console.log(clubWallet, currentGasPrice, _gasLimit);

  if (contract_address) {
    console.log(`Sending ${contract_address} to split contract...`)
    // general token send
    let contract = new ethers.Contract(contract_address, send_abi, wallet);

    // How many tokens?
    let numberOfTokens = BigNumber.from(send_token_amount);
    // Send the tokens
    try {
      await contract
        .transfer(to_address, numberOfTokens)
        .then(async (transferResult: any) => {
          // wait until the block is mined
          await transferResult.wait()
          // make sure the nounceOffset increases for each transaction
          // nounceOffset++;
          console.dir(transferResult);
          alert("sent token");
        });
    } catch (err) {
      console.log(err);
      alert(`failed to send token ${contract_address}`);
    }
  } // ether send
  else {
    console.log(`Sending ETH to split contract`)
    const _ethLeft = await wallet.provider.getBalance(wallet.address);
    const _finalValue = _ethLeft
      .sub(currentGasPrice.mul(BigNumber.from(_gasLimit)))
      .sub(currentGasPrice.mul(BigNumber.from(_gasForDistribute)));
    // make sure it does not return the same nounce even when transactions are called too close to each other
    // const _nounce = await wallet.provider.getTransactionCount(send_account).then((nounce) => nounce + nounceOffset++)
    const tx = {
      from: send_account,
      to: to_address,
      value: _finalValue,
      nonce: wallet.provider.getTransactionCount(send_account, 'latest'),
    };
    console.log(tx)
    try {
      await wallet.sendTransaction(tx).then(async (transaction) => {
        // wait until the block is mined
        // await transaction.wait()
        console.dir(transaction);
        alert("Send ETH finished!");
      });
    } catch (error) {
      console.log(error);
      alert("failed to send ETH!!");
    }
  }
};

