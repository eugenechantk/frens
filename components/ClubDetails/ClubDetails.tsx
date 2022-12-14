import React from "react";
import Image from "next/image";
import { Button } from "../Button/Button";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { IClubInfo } from "../../pages/clubs/[id]";

export default function ClubDetails({data}:{data: IClubInfo}) {
  // console.log('data parsed into ClubDetails', data);
  return (
    <div className="flex flex-col items-start gap-3 w-full">
      <div className="w-[60px] md:w-[52px] h-[60px] md:h-[52px] relative rounded-10 border-2 border-secondary-300 overflow-hidden">
        <Image src={data.club_image} alt={`Profile image for the club`} fill />
      </div>
      {/* Club name and settings button */}
      <div className="flex flex-row items-center gap-4">
        <h1>{data.club_name}</h1>
        <Button variant="secondary-outline">
          <Cog6ToothIcon className=" w-5"/>
        </Button>
      </div>
      {/* Club description */}
      <p>{data.club_description}</p>
    </div>
  );
}
