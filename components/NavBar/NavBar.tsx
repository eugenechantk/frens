import React, { lazy, Suspense } from "react";
import { Button } from "../Button/Button";
import logoSrc from "../../public/logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "../../lib/auth";
const UserAccount = lazy(() => import("../UserAccount/UserAccount"));

export default function NavBar() {
  const user = useAuth();
  const router = useRouter();
  return (
    <div className="w-full min-h-[76px] relative z-50">
      <Button
        variant="ghost"
        className="absolute top-[calc(50%-44px/2)] left-[6px]"
        onClick={() => router.push("/clubs")}
      >
        <h5>My clubs</h5>
      </Button>
      <Image
        src={logoSrc}
        alt="frens Logo"
        className="absolute left-[calc(50%-40px/2+3px)] top-[calc(50%-40px/2+2px)] cursor-pointer"
        onClick={() => {
          if (user.user) {
            router.push("/clubs");
          } else {
            router.push("/");
          }
        }}
      />
      <div className="absolute top-[calc(50%-38px/2)] right-4">
        <Suspense fallback={<Button variant="secondary-outline" className="w-[212px]"/>}>
          <UserAccount />
        </Suspense>
      </div>
    </div>
  );
}
