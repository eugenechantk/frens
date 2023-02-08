import React from "react";
import LoadingHolding from "./LoadingHolding";

export default function LoadingHoldingList() {
  return (
    <div className=" animate-pulse w-full">
      <LoadingHolding />
      <LoadingHolding />
      <LoadingHolding />
    </div>
  );
}
