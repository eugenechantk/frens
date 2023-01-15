import { CameraIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import defaultClubProfile from "../../public/default_club.png";
import { useField } from "@unform/core";

interface IImageUploadProps {
  width?: number;
  imageSrc?: string;
  setImage?: any;
}

export default function ImageUpload({
  width,
  imageSrc,
  setImage,
  ...props
}: IImageUploadProps) {
  const [showHover, setShowHover] = useState(false);
  const [renderImage, setRenderImage] = useState(
    imageSrc ? imageSrc : defaultClubProfile
  );
  const [error, setError] = useState<string>();
  const inputRef = useRef(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // @ts-ignore
    inputRef.current.click();
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files!.length) {
      return;
    }
    if (e.target.files![0].size >= 4400000) {
      setError("File size too big. It must be smaller than 4.4 MB");
    } else {
      // render the uploaded photo in the component
      const src = URL.createObjectURL(e.target.files![0]);
      setRenderImage(src);

      // send the image file back to the form
      setImage(e.target.files![0]);
    }
  };

  return (
    <>
      <button
        className="border-2 border-secondary-300 rounded-10 relative overflow-hidden"
        style={{ width: "94px", aspectRatio: 1 / 1 }}
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
            className=" bg-white/60 backdrop-blur-sm z-10 absolute top-0 left-0 flex flex-col justify-center items-center rounded-8"
            style={{ width: "100%", aspectRatio: 1 / 1 }}
          >
            <CameraIcon className=" w-1/3" />
          </div>
        )}
      </button>
      <input
        type="file"
        style={{ display: "none" }}
        ref={inputRef}
        accept="image/*"
        onChange={handleOnChange}
      />
      {error && (
        <p className="w-full text-sm leading-5 text-gray-400 mt-2">{error}</p>
      )}
    </>
  );
}
