import { CameraIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useState } from "react";
import defaultClubProfile from "../../public/default_club.png";

interface IImageUploadProps {
  width?: number;
  imageSrc?: string;
  onClick?: () => any;
}

export default function ImageUpload({ width, onClick, imageSrc }: IImageUploadProps) {
  const [showHover, setShowHover] = useState(false);
  const renderImage = imageSrc ? imageSrc : defaultClubProfile;
  return (
    <button
      className="border-2 border-secondary-300 rounded-10 relative overflow-hidden"
      style={{ width: "100%", aspectRatio: 1/1 }}
      onMouseOver={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
      onClick={onClick}
    >
      <Image
        src={renderImage}
        alt="Club profile photo"
        fill
        className="z-0 absolute top-0 left-0"
      />
      {showHover && (
        <div
          className=" bg-white/50 backdrop-blur-md z-10 absolute top-0 left-0 flex flex-col justify-center items-center rounded-8"
          style={{ width: "100%", aspectRatio:1/1 }}
        >
          <CameraIcon className=" w-1/3" />
        </div>
      )}
    </button>
  );
}
