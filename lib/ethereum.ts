

// TODO: fix the line break of the sign in message
export const signInMessage =
  "Welcome to frens!\n\nYou are one step away from investing cryptocurrencies with your friends.\n\nClick to sign in and accept the frens Terms of Service\n\nThis request will not trigger a blockchain transaction or cost any gas fees.";
import { ethers } from "ethers";
import { getChainData } from "./chains";

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


