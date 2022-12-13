import clsx from "clsx";
import React, { useState } from "react";

export default function Toggle() {
  // TODO: change this state management to sync with the global state
  // of displaying club or my balance
  const [selected, setSelected] = useState("club");
  return (
    <div className="flex flex-row items-start p-1 gap-1 w-full border-2 border-secondary-300 rounded-full">
      <button
        className={clsx(toggleBtnStruc, selected === "club" && activeStyle)}
        onClick={() => setSelected('club')}
      >
        <h5>Club</h5>
      </button>
      <button
        className={clsx(toggleBtnStruc, selected === "me" && activeStyle)}
        onClick={() => setSelected('me')}
      >
        <h5>Me</h5>
      </button>
    </div>
  );
}

const toggleBtnStruc = clsx(
  // sizing
  "rounded-full py-3 px-4 grow",
  // skin
  "[&>h5]:text-gray-500"
);

const activeStyle = clsx(
  // skin
  "bg-secondary-200 [&>h5]:text-gray-800"
);
