import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";

const createMagic = () => {
  if(typeof window != "undefined") {
    return new Magic("pk_live_257001A814ED44DA", {
      network: "goerli",
      extensions: [new ConnectExtension()],
    })
  }
};

export const magic = createMagic();