import Image from "next/image";
import Link from "next/link";
import React from "react";
import { fetchClubInfo, IClubInfo } from "../../../lib/fetchers";

async function getClubInfo(id: string) {
  const clubInfo: IClubInfo = await fetchClubInfo(id);
  return clubInfo;
}

export default async function ClubCard({ id }: { id: string }) {
  const data = await getClubInfo(id);
  return (
    <Link href={`/clubs/${id}`}>
      <div className="flex flex-col justify-between items-start p-6 h-[212px] bg-white rounded-20 w-full cursor-pointer border border-secondary-300 hover:border-[3px] hover:border-primary-600 ">
        <div className="w-[52px] h-[52px] relative">
          <Image
            src={data.club_image!}
            alt={`Profile image of ${data.club_name}`}
            fill
            className="rounded-10"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex flex-col gap-1 items-start w-full">
          <h3>{data.club_name}</h3>
          {data.club_description && (
            <p className=" text-sm leading-5 w-full line-clamp-2">
              {data.club_description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
