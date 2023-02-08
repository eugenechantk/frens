'use client';

import React, { useState } from "react";
import Image from "next/image";

export default function ClubMemberAvatar({index, profileImage, uid}: {index: number, profileImage:string, uid:string}) {
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
          src={profileImage}
          alt="Member's profile image"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      {show && (
        <div className="absolute top-[2px] left-8 z-10 bg-gray-800 bg-opacity-80 px-3 py-1 rounded-[4px]">
          <p className="text-white text-sm">
            {uid.slice(0, 6)}...${uid.slice(-4)}
          </p>
        </div>
      )}
    </div>
  );
}
