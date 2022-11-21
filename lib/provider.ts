import { ethers } from "ethers";
import { magic } from "./magic";

const createProvider = () => {
  if (typeof window != "undefined") {
    // @ts-ignore
    return new ethers.providers.Web3Provider(magic.rpcProvider);
  }
};

export const provider = createProvider();
