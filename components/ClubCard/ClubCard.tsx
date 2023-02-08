import Image, { StaticImageData } from "next/image";
import React from "react";

interface IClubCardProps {
  clubName: string;
  clubDes: string;
  profileImgUrl: string;
}

export default function ClubCard({
  clubName,
  clubDes,
  profileImgUrl,
  ...props
}: IClubCardProps) {
  return (
    <div
      className="flex flex-col justify-between items-start p-6 h-[212px] bg-white rounded-20 w-full cursor-pointer border border-secondary-300 hover:border-[3px] hover:border-primary-600"
    >
      <div className="w-[52px] h-[52px] relative">
      <Image
        src={profileImgUrl}
        alt={`Profile image of ${clubName}`}
        fill
        className="rounded-10"
        style={{'objectFit': 'cover'}}
      />
      </div>
      <div className="flex flex-col gap-1 items-start w-full">
        <h3>{clubName}</h3>
        {clubDes && (
          <p className=" text-sm leading-5 w-full line-clamp-2">{clubDes}</p>
        )}
      </div>
    </div>
  );
}
