import { CameraIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useRef, useState } from "react";
import defaultClubProfile from "../../public/default_club.png";

interface IImageUploadProps {
  width?: number;
  imageSrc?: string;
}

export default function ImageUpload({
  width,
  imageSrc,
}: IImageUploadProps) {
  const [showHover, setShowHover] = useState(false);
  const [renderImage, setRenderImage] = useState(imageSrc ? imageSrc : defaultClubProfile);
  const hiddenFileInput = useRef(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // @ts-ignore
    hiddenFileInput.current.click();
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files!.length > 0){
      const src = URL.createObjectURL(e.target.files![0]);
      setRenderImage(src);
    }
  }

  return (
    <>
      <button
        className="border-2 border-secondary-300 rounded-10 relative overflow-hidden"
        style={{ width: "100%", aspectRatio: 1 / 1 }}
        onMouseOver={() => setShowHover(true)}
        onMouseLeave={() => setShowHover(false)}
        onClick={handleClick}
        type="button"
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
            style={{ width: "100%", aspectRatio: 1 / 1 }}
          >
            <CameraIcon className=" w-1/3" />
          </div>
        )}
      </button>
      <input type="file" style={{display: 'none'}} ref={hiddenFileInput} accept='image/*' onChange={handleOnChange}/>
    </>
  );
}
