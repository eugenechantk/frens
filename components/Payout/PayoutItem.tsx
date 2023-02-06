import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { IHoldingsData } from "../../lib/ethereum";
import { Button } from "../Button/Button";
import { IOps } from "./PayoutProgressLine";
import Status from "./Status";



export default function PayoutItem({
  token,
  txnHash,
  txnStatus,
  error,
}: {
  token:string | IHoldingsData;
  txnHash?: string;
  txnStatus?: "pending" | "done" | "in-progress";
  error?: any;
}) {
  return (
    <div className="flex flex-row items-start mb-[26px] gap-3 h-[50px]">
      <Status status={txnStatus} error={error}/>
      <div className="flex flex-col gap-[2px] items-start">
        <p>{typeof token === "string" ? token : `Distribute ${token.name}`}</p>
        {txnHash && (
          <Link href={`${process.env.NEXT_PUBLIC_ETHERSCAN_DOMAIN}/tx/${txnHash}`} target="_blank">
          <Button variant="text-only" size="sm" className="opacity-60">
            <p>View reciept</p>
            <ArrowTopRightOnSquareIcon className="w-4" />
          </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
