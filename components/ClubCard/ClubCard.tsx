import Image, { StaticImageData } from "next/image";
import React from "react";

interface IClubCardProps {
  clubName: string;
  clubDes: string;
  profileImgUrl: string | StaticImageData;
}

export default function ClubCard({
  clubName,
  clubDes,
  profileImgUrl,
}: IClubCardProps) {
  return (
    <div
      className="flex flex-col justify-between items-start p-6 h-[212px] bg-white rounded-20 w-full cursor-pointer border-[3px] border-white hover:border-primary-600"
      onClick={() => console.log(`${clubName} clicked`)}
    >
      <Image
        src={profileImgUrl}
        alt={`Profile image of ${clubName}`}
        width={52}
        height={52}
        className="rounded-10"
      />
      <div className="flex flex-col gap-1 items-start w-full">
        <h3>{clubName}</h3>
        <p className=" text-sm leading-5 w-full line-clamp-2">{clubDes}</p>
      </div>
    </div>
  );
}
