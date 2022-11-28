import React from "react";
import { Button } from "../Button/Button";
import logoSrc from "../../public/logo.png";
import Image from "next/image";
import UserAccount from "../UserAccount/UserAccount";

export default function NavBar() {
  return (
    <div className="w-full h-[76px] relative">
      <Button
        variant="ghost"
        className="absolute top-[calc(50%-44px/2)] left-[6px]"
      >
        <h5>My clubs</h5>
      </Button>
      <Image
        src={logoSrc}
        alt="frens Logo"
        className="absolute left-[calc(50%-40px/2+3px)] top-[calc(50%-40px/2+2px)]"
      />
      <div className="absolute top-[calc(50%-38px/2)] right-4">
        <UserAccount/>
      </div>
    </div>
  );
}
