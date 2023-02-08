import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Suspense } from "react";
import { Button } from "../../../../components/Button/Button";
import { redis } from "../../../../lib/redis";
import HoldingList from "./HoldingList";
import Link from 'next/link';
import LoadingHoldingList from "./LoadingHoldingList";

export default async function PortfolioWrapper(id: { id: string }) {
  const club_wallet_address = await redis.hget(id.id, "wallet_address");
  return (
    <div className="w-full flex flex-col items-start gap-3">
      {/* Title */}
      <div className="flex flex-row justify-between items-center w-full">
        <h2>Portfolio</h2>
        <Link href={`${process.env.NEXT_PUBLIC_ETHERSCAN_DOMAIN}/address/${club_wallet_address}`} target="_blank">
        <Button variant="text-only" size="sm">
          <p className="!text-gray-500 !font-sans">View activity</p>
          <ArrowTopRightOnSquareIcon className="w-5 !text-gray-500" />
        </Button>
        </Link>
      </div>
      <Suspense fallback={<LoadingHoldingList/>}>
        {/* @ts-expect-error Server Component */}
        <HoldingList club_wallet_address="0xb87bB2635C2b17f2861A347f2D7b23a2aA3c9A2d" />
      </Suspense>
    </div>
  );
}
