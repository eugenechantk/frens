import React, { lazy, useState, Suspense } from "react";
import { IClubInfo } from "../../pages/clubs/[id]";
import LoadingWidget from "./LoadingWidget";
import WidgetToggle from "./WidgetToggle";
const TradeAsset = lazy(() => import("./TradeAsset"));
const BuyInWidgetWrapper = lazy(() => import("./BuyInWidget/BuyInWidgetWrapper"));

export default function WidgetSection({data}:{data: IClubInfo}) {
  const [selected, setSelected] = useState("invest");
  return (
    <div className="flex flex-col items-start gap-2">
      <WidgetToggle selected={selected} setSelected={setSelected} />
      <div className="w-full md:w-[376px] h-min-[408px] border border-secondary-300 shrink-0 rounded-20 p-2 flex flex-col items-start gap-2">
        <Suspense fallback={<LoadingWidget />}>
          {selected === "invest" && <h3>Trading assets</h3>}
          {selected === "buyin" && <BuyInWidgetWrapper data={data}/>}
        </Suspense>
      </div>
    </div>
  );
}
