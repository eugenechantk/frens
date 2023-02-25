import axios from "axios";
import { BigNumber, ethers, Wallet } from "ethers";
import _ from "lodash";
import { abi, minABI } from "./abi";
import { getChainData } from "./chains";
import { IClubInfo } from './fetchers';

/**
 * This interface is used to define the structure of a member's share percentage
 */
export interface IHolderPower {
  address: string, 
  sharesBps: number
}

/**
 * This interface is used to define the structure of the transfer event fetched from moralis
 */
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

/**
 * This interface is used to define the the object that holds each club member's club token balance
 */
export interface IClubMemberBalance {
  [member_address: string]: number;
}

/**
 * This interface is used to define the structure of each holding in the club's portfolio
 */
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


export const signInMessage =
  "Welcome to frens!\n\nYou are one step away from investing cryptocurrencies with your friends.\n\nClick to sign in and accept the frens Terms of Service\n\nThis request will not trigger a blockchain transaction or cost any gas fees.";

/**
 * @returns a JsonRpcProvider object that is connected to the INFURA node
 */
export function getInfuraProvider() {
  const rpcUrl = getChainData(
    parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!)
  ).rpc_url;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return provider
}

/**
 * Get the latest block number, using the INFURA rpc node
 * @returns {number} the latest block number
 */ 
export async function getLatestBlockNumber() {
  // STEP 2: Get the transfer events ellapsed from last time the club is retrieved
  const rpcUrl = getChainData(
    parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!)
  ).rpc_url;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const currentBlock = await provider.getBlockNumber();
  return currentBlock;
}
 


/** 
 * function to verfiy signature with user address
 * @param {string} sig - the signature to be verified
 * @param {string} address - the user address
 */
export function verifyAddress(sig: string, userAddress: string): boolean {
  const recoveredAddress = ethers.utils.verifyMessage(signInMessage, sig);
  return (userAddress === recoveredAddress)
}

/**  
 * initilaize a wallet given mnemonic, and connect to infura node
 * @param {string} mnemonic - the mnemonic of the club wallet
 * @returns {Wallet} a ethers.js Wallet object
*/
export function initWallet(clubWalletMnemonic: string) {
  let wallet = ethers.Wallet.fromMnemonic(clubWalletMnemonic);
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

/**   
 * utility function to send transaction from a wallet
 * @param {any} transaction - the transaction object
 * @param {Wallet} wallet - the ethers.js wallet to send the transaction from
 * @returns {string | null} the transaction hash, or null
*/
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

/**  
 * Get all the token addresses that the user has 
 * 
 * @param {string} userAddress - the user address
 * @returns {string[]} an array of token addresses the user owns
*/
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

/**  
 * Return a boolean value if the user's wallet holds a specific club token
 * 
 * @param {string} userAddress - the user address
 * @param {string} clubTokenAddress - the club token address
 * 
 * @returns {boolean} true if the user holds the club token, false otherwise
 * */ 
export async function verifyClubHolding(
  userAddress: string,
  clubTokenAddress: string
): Promise<boolean> {
  let verified = false;
  let contract = new ethers.Contract(clubTokenAddress, minABI, getInfuraProvider());
  await contract.functions.balanceOf(userAddress).then((result: BigNumber[]) => {
    if (!result[0].eq(0)) {
      verified = true;
    }
  });
  return verified
}

/**  
 * Returns USD price of the token
 * 
 * @param {string} tokenAddress - the token address
 * @returns {number} the USD price of the token
 * */ 
export async function getUsdPrice(tokenAddress?: string): Promise<number> {
  const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_KEY;
  let usdPrice = 0;
  const apiOptions = {
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
        .request(apiOptions)
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

/** 
 * Get member's club token balance
 * 
 * @param {IClubInfo} clubInfo - The information of the club
 * @returns {Promise<IClubMemberBalance>} - The club member list with their token balance
 * */ 
export async function getClubMemberBalance (clubInfo: IClubInfo) {
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

/** 
 * To calculate the claim power of each member
 * 
 * Claim power is the percentage (in base points) of the club member club token ownership compared to the total supply
 * 
 * @param {IClubInfo} clubInfo - The information of the club
 * @param {IClubMemberBalance} _club_members - The club member list with their club token balance
 * 
 * @returns {IHolderPower[]} - The club member list with their claim power in base points
 * */ 
export const getClaimPower = (clubInfo: IClubInfo, _club_members: IClubMemberBalance) => {
  const totalSupply = Object.values(_club_members).reduce(
    (sum, cur) => (sum += cur)
  );
  let _holderPower: IHolderPower[] = [];
  Object.keys(_club_members).forEach((member) => {
    _holderPower.push({address: member, sharesBps: ((_club_members[member] / totalSupply)*10000)|0});
  });
  const memberClaimPower = _holderPower.reduce((acc, holder) => {return acc += holder.sharesBps},0)
  _holderPower.push({address: clubInfo.club_wallet_address!, sharesBps: 10000 - memberClaimPower})
  return _holderPower
};

/** 
 * Fetch all the assets of an address 
 * 
 * @param {string} address - The address to fetch the assets
 * 
 * @returns {Promise<IHoldingsData[]>} - The list of assets, with their metadata including token address, balance, etc.
 * */ 
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

/** 
 * Send specific token to an address (can be contract or wallet) 
 * 
 * @param {string} to_address - The contract address to send the token to
 * @param {Wallet} clubWallet - The club wallet to send the token from
 * @param {string} send_token_amount - The amount of token to send
 * @param {string=} token_address - The address of the token to be sent (none for ETH)
 * @param {number=} _gasForDistribute - The gas limit for distributing the tokens (only for split contract)
 * 
 * @returns {Promise<TransactionResponse>} - The transaction response
 * */
export const sendToken = async (
  to_address: string,
  clubWallet: Wallet,
  send_token_amount?: string,
  token_address?: string,
  _gasForDistribute?: number,
) => {
  let wallet = clubWallet
  let send_abi = abi;
  let send_account = wallet.getAddress();
  // Base ethereum transfer gas of 21000 + contract execution gas (usually total up to 27xxx)
  const _gasLimit = ethers.utils.hexlify(parseInt(process.env.NEXT_PUBLIC_SEND_ETH_GAS_LIMIT!));

  const {maxFeePerGas} = await wallet.provider.getFeeData();
  // console.log(clubWallet, maxFeePerGas, _gasLimit);

  if (token_address) {
    console.log(`Sending ${token_address} to split contract...`)
    // general token send
    let contract = new ethers.Contract(token_address, send_abi, wallet);

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
          return transferResult;
        });
    } catch (err) {
      throw err;
    }
  } // ether send
  else {
    console.log(`Sending ETH to split contract`)
    const _ethLeft = await wallet.provider.getBalance(wallet.address);
    const _finalValue = _ethLeft
      .sub(maxFeePerGas!.mul(BigNumber.from(_gasLimit)))
      .sub(maxFeePerGas!.mul(BigNumber.from(_gasForDistribute)));
    // console.log(_finalValue)
    // make sure it does not return the same nounce even when transactions are called too close to each other
    // const _nounce = await wallet.provider.getTransactionCount(send_account).then((nounce) => nounce + nounceOffset++)
    const tx = {
      from: send_account,
      to: to_address,
      value: _finalValue,
      gasLimit: _gasLimit,
      gasPrice: maxFeePerGas!,
      nonce: wallet.provider.getTransactionCount(send_account, 'latest'),
    };
    try {
      await wallet.sendTransaction(tx).then(async (transaction) => {
        // wait until the block is mined
        await transaction.wait();
        return transaction;
      });
    } catch (error) {
      throw error
    }
  }
};

