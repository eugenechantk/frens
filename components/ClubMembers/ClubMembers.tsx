import Image from "next/image";
import React, { useState } from "react";
import { IMemberInfoData } from "../../pages/clubs/[id]";
import { Button } from "../Button/Button";

export default function ClubMembers({ data }: { data: IMemberInfoData[] }) {
  // console.log('data parsed into ClubMembers', data)
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <div className="flex flex-row">
        {data.map((member, index) => {
          const [show, setShow] = useState(false);
          return (
            <div
              key={index}
              className="first:ml-0 -ml-1 relative"
              onMouseOver={() => setShow(true)}
              onMouseLeave={() => setShow(false)}
            >
              <div
                className="w-8 h-8 rounded-full outline-2 outline-secondary-600 relative"
                id={`member-${index}`}
              >
                <Image
                  src={member.profile_image}
                  alt="Member's profile image"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              {show && (
                <div className="absolute top-[2px] left-8 z-10 bg-gray-800 bg-opacity-80 px-3 py-1 rounded-[4px]">
                  <p className="text-white text-sm">
                    {member.uid.slice(0, 6)}...${member.uid.slice(-4)}
                  </p>
                </div>
              )}
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
