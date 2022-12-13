import clsx from "clsx";
import React, { useState } from "react";

interface IWidgetToggle {
  setSelected: (selected: string) => void;
  selected: string;
}

export default function WidgetToggle({selected, setSelected}: IWidgetToggle) {
  // TODO: change this state management to sync with the global state
  // of displaying club or my balance
  return (
    <div className="flex flex-row items-start p-1 gap-1 w-full border-2 border-secondary-300 rounded-full">
      <button
        className={clsx(toggleBtnStruc, selected === "invest" && activeStyle)}
        onClick={() => setSelected('invest')}
      >
        <h5>Invest assets</h5>
      </button>
      <button
        className={clsx(toggleBtnStruc, selected === "buyin" && activeStyle)}
        onClick={() => setSelected('buyin')}
      >
        <h5>Buy into club</h5>
      </button>
    </div>
  );
}

const toggleBtnStruc = clsx(
  // sizing
  "rounded-full py-3 px-4 grow",
  // skin
  "[&>h5]:text-gray-500 [&>h5]:leading-5"
);

const activeStyle = clsx(
  // skin
  "bg-primary-600 [&>h5]:text-white"
);

