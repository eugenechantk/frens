import React, { useState } from "react";
import Image from "next/image";
import { fetchClubInfo, IClubInfo } from "../../../../lib/fetchers";

async function getClubInfo (id: string) {
  const clubInfo: IClubInfo = await fetchClubInfo(id);
  return clubInfo
}

export default async function ClubDetails({id}: {id:string})
 {
  const clubInfo = await getClubInfo(id);
  return (
    <div className="flex flex-col items-start gap-3 w-full">
      <div className="w-[60px] md:w-[52px] h-[60px] md:h-[52px] relative rounded-10 border-2 border-secondary-300 overflow-hidden">
        <Image
          src={clubInfo.club_image!}
          alt={`Profile image for the club`}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      {/* Club name and settings button */}
      <div className="flex flex-row items-center gap-4">
        <h1>{clubInfo.club_name}</h1>
      </div>
      {/* Club description */}
      <p>{clubInfo.club_description}</p>
    </div>
  );
}
