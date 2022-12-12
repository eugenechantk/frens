import Image from "next/image";
import React from "react";
import ReactTooltip from "react-tooltip";
import defaultAvatar from "../../public/default_avatar.png";
import { Button } from "../Button/Button";

const members = [
  "Alpha male",
  "Beta male",
  "Boring ape",
  "0xF4219Da1F9Ddfcdb414C9413c92A6771e056414a",
];

export default function ClubMembers() {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <div className="flex flex-row">
        {members.map((member, index) => {
          return (
            <>
              <div
                className="w-8 h-8 rounded-full outline-2 outline-secondary-600 relative first:ml-0 -ml-1"
                key={index}
                id={`member-${index}`}
                data-for={`member-${index}-tooltip`}
                data-tip={member.startsWith('0x') ? `${member.slice(0, 6)}...${member.slice(-4)}` : member}
              >
                <Image src={defaultAvatar} alt="Member's profile image" fill />
              </div>
              <ReactTooltip
                id={`member-${index}-tooltip`}
                place="bottom"
                effect="solid"
                className="rounded-8"
              />
            </>
          );
        })}
      </div>
      <Button variant="outline" size="sm" className="h-[44px]">
        <h3>Invite</h3>
      </Button>
    </div>
  );
}
