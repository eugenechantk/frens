import React from "react";
import defaultProfile from "../../public/default_club.png";
import Image from "next/image";
import { Button } from "../Button/Button";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function ClubDetails() {
  return (
    <div className="flex flex-col items-start gap-3 w-full">
      <div className="w-[60px] md:w-[52px] h-[60px] md:h-[52px] relative rounded-10 border-2 border-secondary-300 overflow-hidden">
        <Image src={defaultProfile} alt={`Profile image for the club`} fill />
      </div>
      {/* Club name and settings button */}
      <div className="flex flex-row items-center gap-4">
        <h1>Satoshi Club</h1>
        <Button variant="secondary-outline">
          <Cog6ToothIcon className=" w-5"/>
        </Button>
      </div>
      {/* Club description */}
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris eleifend condimentum vel consectetur semper justo, dictum.</p>
    </div>
  );
}
