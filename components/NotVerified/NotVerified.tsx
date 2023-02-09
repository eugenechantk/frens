import Image from "next/image";
import React from "react";
import { Button } from "../Button/Button";
import Magnify3d from "../../public/Magnifying_3d.png"
import { useRouter } from "next/router";

export default function NotVerified() {
  const router = useRouter();
  return (
    <div className="h-full max-w-[480px] py-8 md:py-12 px-4 md:px-6 flex flex-col items-center justify-center gap-4 mx-auto">
      <Image src={Magnify3d} alt="not authorized" height={86} />
      <div className="flex flex-col gap-2">
        <h3 className="text-center">Looks like you are lost</h3>
        <p className="text-center">
        You seem to not have access to this page. Just refresh or go back to where you came from.
        </p>
      </div>
      <Button className="w-[180px]" variant="secondary" onClick={() => router.back()}>
        <h5>Go back</h5>
      </Button>
    </div>
  );
}
