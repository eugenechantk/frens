import React, { Suspense } from "react";
import { Theme, SwapWidget } from "@uniswap/widgets";
import { provider } from "../../lib/provider";
import { getChainData } from "../../lib/chains";

const jsonRpcUrlMap = {
  1: [getChainData(1).rpc_url],
  5: [getChainData(5).rpc_url],
};

const swapWidgetTheme: Theme = {
  accent: "#5A4FF3",
  container: "#F2F0EB",
  module: "#EAE7E1",
  interactive: "#D7D4CD",
  dialog: "#F2F0EB",
  fontFamily: "Montserrat",
};

export default function TradeAsset() {
  return (
    <div className="w-full md:w-[376px] border border-secondary-300 shrink-0 rounded-20 p-2 flex flex-col items-start gap-2">
      <h3 className="mt-[6px] ml-3">Invest in club assets</h3>
      <SwapWidget
        provider={provider}
        // jsonRpcUrlMap={jsonRpcUrlMap}
        width="100%"
        theme={swapWidgetTheme}
      />
    </div>
  );
}
