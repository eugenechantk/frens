import Image from "next/image";
import React from "react";
import { useAuth } from "../../lib/auth";
import Lock3d from "../../public/Lock_3d.png";
import { Button } from "../Button/Button";

export default function NotAuthed() {
  return (
    <div className="h-full max-w-[480px] py-8 md:py-12 px-4 md:px-6 flex flex-col items-center justify-center gap-4 mx-auto">
      <Image src={Lock3d} alt="locked out" height={86} />
      <div className="flex flex-col gap-2">
        <h3 className="text-center">Log in to invest together</h3>
        <p className="text-center">
          frens is for everyone. But you first have to sign up or log in to
          start investing with your friends
        </p>
      </div>
      <Button
        className="w-60"
        onClick={() => {
          const accountButton = document.getElementById("account-button")
          accountButton?.click();
        }}
      >
        <h5>Sign up or Log in</h5>
      </Button>
    </div>
  );
}
