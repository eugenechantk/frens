import Image from "next/image";
import React from "react";
import ReactTooltip from "react-tooltip";
import { TMemberInfoData } from "../../pages/clubs/[id]";
import { Button } from "../Button/Button";

export default function ClubMembers({data}: {data: TMemberInfoData[]}) {
  // console.log('data parsed into ClubMembers', data)
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <div className="flex flex-row">
        {data.map((member, index) => {
          return (
            <div key={index} className="first:ml-0 -ml-1">
              <div
                className="w-8 h-8 rounded-full outline-2 outline-secondary-600 relative"
                id={`member-${index}`}
                data-for={`member-${index}-tooltip`}
                // data-tip={member.display_name.startsWith('0x') ? `${member.display_name.slice(0, 6)}...${member.display_name.slice(-4)}` : member.display_name}
                data-tip={`${member.uid.slice(0, 6)}...${member.uid.slice(-4)}`}
              >
                <Image src={member.profile_image} alt="Member's profile image" fill style={{'objectFit': 'cover'}}/>
              </div>
              <ReactTooltip
                id={`member-${index}-tooltip`}
                place="bottom"
                effect="solid"
                className="rounded-8"
              />
            </div>
          );
        })}
      </div>
      <Button variant="outline" size="sm" className="h-[44px]">
        <h3>Invite</h3>
      </Button>
    </div>
  );
}
