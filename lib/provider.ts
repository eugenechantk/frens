import { ethers } from "ethers";
import { magic } from "./magic";

export let signer: ethers.Signer;

const createProvider = () => {
  if (typeof window != "undefined") {
    // @ts-ignore
    return new ethers.providers.Web3Provider(magic.rpcProvider);
  }
};

export const getSigner = () => {
  if (typeof window != "undefined") {
    if (!signer) {
      signer = provider!.getSigner();
    }
    return signer;
  }
}

export const provider = createProvider();
