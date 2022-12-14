import React from "react";
import Spinner from "../Spinner/Spinner";

export default function LoadingWidget() {
  return (
    <div className="w-full md:w-[376px] min-h-[475px] flex flex-col items-center justify-center gap-2">
      <Spinner size={48}/>
      <h4>Loading...</h4>
    </div>
  );
}
