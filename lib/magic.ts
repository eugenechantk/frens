import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";

const createMagic = () => {
  if(typeof window != "undefined") {
    return new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY!, {
      network: "goerli",
      extensions: [new ConnectExtension()],
    })
  }
};

export const magic = createMagic();