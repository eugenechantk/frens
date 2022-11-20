import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../Button/Button";
import devProfilePic from "../../public/user_avatar.png";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { provider } from "../../lib/provider";
import { magic } from "../../lib/magic";

interface IAccountButtonProps {
  authed?: boolean;
  onClick?: () => void;
}

export default function AccountButton({
  authed,
  onClick,
  ...props
}: IAccountButtonProps) {
  const [renderAuth, setRenderAuth] = useState(!authed ? false : true);
  
  const handleLogin = async () => {
    await provider!.send("eth_accounts", []);
    setRenderAuth(true);
  };

  const handleLogout = async () => {
    await magic?.connect.disconnect().catch((e) => console.log(e));
    setRenderAuth(false);
  }

  return (
    <>
      <Button
        type="secondary-outline"
        className="w-[70px] h-[38px] px-1"
        onClick={!renderAuth ? handleLogin : onClick}
      >
        {!renderAuth ? (
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
