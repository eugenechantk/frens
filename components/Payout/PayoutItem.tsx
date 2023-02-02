import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Button } from "../Button/Button";
import Step from "../Stepper/Step";
import Status from "./Status";

export default function PayoutItem({
  title,
  txnUrl,
  txnStatus,
  error,
}: {
  title:string;
  txnUrl?: string;
  txnStatus?: "pending" | "done" | "in-progress";
  error?: any;
}) {
  return (
    <div className="flex flex-row items-start mb-[26px] gap-3 h-[50px]">
      <Status status={txnStatus} error={error}/>
      <div className="flex flex-col gap-[2px] items-start">
        <p>{title}</p>
        {txnUrl && (
          <Button variant="text-only" size="sm" className="opacity-60">
            <p>View reciept</p>
            <ArrowTopRightOnSquareIcon className="w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
