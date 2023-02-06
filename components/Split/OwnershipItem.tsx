import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../Button/Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import IndividualHolding from "./IndividualHolding";
import { IHoldingsData } from "../../lib/ethereum";
import { IMemberInfoAndClaimPower } from "../../pages/clubs/[id]/close";
import { useAuth } from "../../lib/auth";

export default function OwnershipItem({
  member,
  clubPortfolio,
}: {
  member: IMemberInfoAndClaimPower;
  clubPortfolio: IHoldingsData[];
}) {
  const [expand, setExpand] = useState(false);
  const user = useAuth()

  return (
    <div className="flex flex-col gap-1 py-2 border-b border-secondary-300">
      {/* Expand button */}
      <Button variant="text-only" onClick={() => setExpand(!expand)}>
        <div className="flex flex-row gap-3 p-1 w-full items-center">
          <Image
            src={member.profile_image}
            alt="user profile"
            height={32}
            width={32}
          />
          {/* Display name and address */}
          <div className="flex flex-row gap-2 grow">
            <div className="flex flex-col gap-[2px] grow">
              <h5 className=" text-left">{member.uid === user.user?.uid ? "Me" : member.display_name}</h5>
              <p className="text-sm text-gray-400 text-left">
                {member.uid.slice(0, 6)}...{member.uid.slice(-4)}
              </p>
            </div>
            {/* Percentage share and expand icon */}
            <div className="flex flex-row gap-[2px] items-center">
              <h4 className=" inline-block">{member.share/100}</h4>
              <h4 className="text-gray-400">%</h4>
              <ChevronDownIcon className="ml-2 w-5" />
            </div>
          </div>
        </div>
      </Button>
      {/* Split amount */}
      {expand && (
        <div className="flex flex-col gap-4 pt-1 pr-2 pb-3 pl-[52px]">
          <p className="text-sm uppercase font-bold text-gray-400">
            Split amount
          </p>
          {clubPortfolio.map((token, index) => <IndividualHolding key={index} token={token} share={member.share}/>)}
        </div>
      )}
    </div>
  );
}
