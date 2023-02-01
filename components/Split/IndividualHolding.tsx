import React from "react";

export default function IndividualHolding() {
  return (
    <div className="flex flex-row gap-2">
      {/* Token name */}
      <h5 className="text-gray-500 grow">Ethereum</h5>
      {/* Token amount */}
      <h5 className=" inline-block text-gray-500">1,234,567</h5>
      <h5 className=" inline-block text-gray-400">ETH</h5>
    </div>
  );
}
