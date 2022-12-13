import React from "react";
import Spinner from "../Spinner/Spinner";

export default function LoadingWidget() {
  return (
    <div className="w-full md:w-[376px] min-h-[475px] border border-secondary-300 shrink-0 rounded-20 p-2 flex flex-col items-center justify-center gap-2">
      <Spinner />
      <p>Loading...</p>
    </div>
  );
}
