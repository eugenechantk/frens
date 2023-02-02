import React from "react";

export default function IndividualHolding() {
  return (
    <div className="flex flex-row gap-2">
      {/* Token name */}
      <p className="text-gray-500 grow font-semibold text-sm">Ethereum</p>
      {/* Token amount */}
      <p className=" inline-block text-gray-500 font-semibold text-sm">1,234,567</p>
      <p className=" inline-block text-gray-400 text-sm">ETH</p>
    </div>
  );
}
