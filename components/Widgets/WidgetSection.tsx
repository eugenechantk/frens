import React, { lazy, useState, Suspense } from "react";
import LoadingWidget from "./LoadingWidget";
import WidgetToggle from "./WidgetToggle";
const TradeAsset = lazy(() => import("./TradeAsset"));
const BuyIn = lazy(() => import("./BuyInWidget"));

export default function WidgetSection() {
  const [selected, setSelected] = useState("invest");
  return (
    <div className="flex flex-col items-start gap-2">
      <WidgetToggle selected={selected} setSelected={setSelected} />
      <div className="w-full md:w-[376px] border border-secondary-300 shrink-0 rounded-20 p-2 flex flex-col items-start gap-2">
        <Suspense fallback={<LoadingWidget />}>
          {selected === "invest" && <TradeAsset />}
          {selected === "buyin" && <BuyIn />}
        </Suspense>
      </div>
    </div>
  );
}
