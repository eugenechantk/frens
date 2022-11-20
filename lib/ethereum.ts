// message to sign for auth
export const signInMessage = "hello world";
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
