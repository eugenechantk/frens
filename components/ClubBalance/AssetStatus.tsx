import clsx from "clsx";
import Image from "next/image";
import React from "react";
import upArrow from "../../public/illustrations/up_arrow.svg";
import downArrow from "../../public/illustrations/down_arrow.svg";
import equal from "../../public/illustrations/equal.svg";

interface IAssetStatusProps {
  variant: "change" | "total";
  value: number;
  className?: string;
}

export default function AssetStatus({ variant, value, className }: IAssetStatusProps) {
  return (
    <div
      className={clsx(
        variant === "total" && totalStyle,
        variant === "change" &&
          (value > 0 ? profitStyle : value < 0 ? lossStyle : equalStyle),
        assetStatusStruc,
        className
      )}
    >
      <p>{variant === "change" ? "Profit and loss" : "total assets"}</p>
      <div className="flex flex-row items-center gap-1 w-full">
        {variant === "change" && (
          <div className="w-6 h-6">
            <Image
              src={value > 0 ? upArrow : value < 0 ? downArrow : equal}
              alt="icon for asset metrics"
            />
          </div>
        )}
        <h3 className="min-w-0 text-clip overflow-hidden">{`$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</h3>
      </div>
    </div>
  );
}

const assetStatusStruc = clsx(
  // sizing
  "p-4 rounded-10",
  // flexbox
  "flex flex-col items-start gap-[2px]",
  // font styling
  "[&>p]:text-xs [&>p]:font-bold [&>p]:uppercase [&>p]:leading-4",
  "[&>*>h3]:text-[32px] [&>*>h3]:font-medium [&>*>h3]:leading-[32px]"
);

const profitStyle = clsx(
  // skin
  "bg-green-600",
  // text color
  "[&>*>h3]:text-white [&>p]:text-white"
);

const lossStyle = clsx(
  // skin
  "bg-red-500",
  // text color
  "[&>*>h3]:text-white [&>p]:text-white"
);

const equalStyle = clsx(
  // skin
  "bg-secondary-200 border border-secondary-300",
  // text color
  "[&>*>h3]:text-gray-800 [&>p]:text-gray-800"
);

const totalStyle = clsx(
  // skin
  "bg-secondary-200 border border-secondary-300",
  // text color
  "[&>*>h3]:text-secondary-500 [&>p]:text-secondary-500"
);
