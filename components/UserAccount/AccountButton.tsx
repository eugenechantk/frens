import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import { Button } from "../Button/Button";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { provider } from "../../lib/provider";

import { signInMessage } from "../../lib/ethereum";
import { signInWithCustomToken } from "firebase/auth";
import { firebaseClientAuth } from "../../firebase/firebaseClient";
import { useAuth } from "../../lib/auth";

interface IAccountButtonProps {
  onClick?: (e: any) => void;
  profilePicUrl: string | StaticImageData;
}

export default function AccountButton({
  onClick,
  profilePicUrl,
  ...props
}: IAccountButtonProps) {
  const { user } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    await provider!.send("eth_accounts", []);

    // getting the end-users signer
    const _signer = provider!.getSigner();
    const address = await _signer!.getAddress();

    // sending the message for the end-user to sign
    const sig = await _signer?.signMessage(signInMessage);

    // const recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, sig!);
    const {token, new_user} = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        sig,
      }),
    })
      .then((res) => {return res.json()})
      .catch((err) => console.log(err));
    await signInWithCustomToken(firebaseClientAuth, token);
  };

  return (
    <Button
      type="secondary-outline"
      className="w-[70px] h-[38px] px-1"
      onClick={user ? onClick : handleLogin}
    >
      {!user ? (
        <h6>Log in</h6>
      ) : (
        <>
          <Image
            src={profilePicUrl}
            alt="User Profile"
            width={30}
            height={30}
          />
          <ChevronDownIcon className="w-5 mr-2" />
        </>
      )}
    </Button>
  );
}
