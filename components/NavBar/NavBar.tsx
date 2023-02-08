import React, { Suspense } from "react";
import { Button } from "../Button/Button";
import logoSrc from "../../public/logo.png";
import Image from "next/image";
import UserAccount from "../../app/clubs/Components/UserAccount/UserAccount";
import Link from "next/link";

export default function NavBar() {
  return (
    <div className="w-full min-h-[76px] relative z-50">
      <Link href="/clubs">
        <Button
          variant="ghost"
          className="absolute top-[calc(50%-44px/2)] left-[6px]"
        >
          <h5>My clubs</h5>
        </Button>
      </Link>
      <Link href="/clubs">
        <Image
          src={logoSrc}
          alt="frens Logo"
          className="absolute left-[calc(50%-40px/2+3px)] top-[calc(50%-40px/2+2px)] cursor-pointer"
        />
      </Link>
      <div className="absolute top-[calc(50%-38px/2)] right-4">
        <Suspense fallback={<Button variant="secondary-outline" loading className="h-[38px] w-[70px]"/>}>
          <UserAccount />
        </Suspense>
      </div>
    </div>
  );
}
