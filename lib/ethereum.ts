// TODO: fix the line break of the sign in message
export const signInMessage = 'Welcome to frens!\n\nYou are one step away from investing cryptocurrencies with your friends.\n\nClick to sign in and accept the frens Terms of Service\n\nThis request will not trigger a blockchain transaction or cost any gas fees.';
import { ethers } from "ethers";

// function to verfiy signature with user address
export function verifyAddress(sig: string, address: string):boolean {
  const recoveredAddress = ethers.utils.verifyMessage(signInMessage, sig);
  if(address === recoveredAddress) {
    return true
  } else {
    return false
  }
}
