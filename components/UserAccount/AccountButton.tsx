import Image from "next/image";
import React from "react";
import { Button } from "../Button/Button";
import devProfilePic from "../../public/user_avatar.png";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { provider } from "../../lib/provider";
import { magic } from "../../lib/magic";

interface IAccountButtonProps {
  authed?: boolean;
}

export default function AccountButton({
  authed,
  ...props
}: IAccountButtonProps) {
  const handleLogin = async () => {
    await provider!.send("eth_accounts", []);
  };

  const handleLogout = async () => {
    await magic?.connect.disconnect().catch((e) => console.log(e));
  }
  return (
    <>
      <Button
        type="secondary-outline"
        className="w-[70px] h-[38px] px-1"
        onClick={handleLogin}
      >
        {!authed ? (
          <h6>Log in</h6>
        ) : (
          <>
            <Image
              src={devProfilePic}
              alt="User Profile"
              width={30}
              height={30}
            />
            <ChevronDownIcon className="w-5 mr-2" />
          </>
        )}
      </Button>
      <button onClick={handleLogout}>Log out</button>
    </>
  );
}
