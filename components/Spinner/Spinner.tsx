import React from "react";
import PulseLoader from "react-spinners/PulseLoader";
import successImg from "../../public/status/status_success.png";
import errorImg from "../../public/status/status_error.png";
import Image from "next/image";

interface ISpinnerProps {
  loading?: boolean;
  success?: boolean;
  error?: any;
  size?: number;
  color?: string;
}

export default function Spinner({
  loading = true,
  success,
  error,
  size = 64,
  color = "#5A4FF3",
}: ISpinnerProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {error ? (
        <Image src={errorImg} alt="successfully loaded" fill />
      ) : error ? (
        <Image src={successImg} alt="successfully loaded" fill />
      ) : (
        <div className=" flex flex-row items-center justify-center w-full h-full">
          <PulseLoader
            loading
            size={size! / 6}
            color={color}
            margin={size! / 16}
          />
        </div>
      )}
    </div>
  );
}
