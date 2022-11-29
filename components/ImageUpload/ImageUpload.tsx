import { CameraIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useState } from "react";
import defaultClubProfile from "../../public/default_club.png";

interface IImageUploadProps {
  width: number;
  onClick?: () => any;
}

export default function ImageUpload({ width, onClick }: IImageUploadProps) {
  const [showHover, setShowHover] = useState(false);
  // TODO: set renderImage to load the club profile image
  const renderImage = defaultClubProfile;
  return (
    <button
      className="border-2 border-secondary-300 rounded-10 relative overflow-clip"
      style={{ width: width, height: width }}
      onMouseOver={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
      onClick={onClick}
    >
      <Image
        src={defaultClubProfile}
        alt="Club profile photo"
        fill
        className="z-0 absolute top-0 left-0"
      />
      {showHover && (
        <div
          className=" bg-white/50 backdrop-blur-md z-10 absolute top-0 left-0 flex flex-col justify-center items-center"
          style={{ width: width - 4, height: width - 4 }}
        >
          <CameraIcon className=" w-1/3" />
        </div>
      )}
    </button>
  );
}
