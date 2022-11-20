import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../Button/Button";
import devProfilePic from "../../public/user_avatar.png";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { provider } from "../../lib/provider";
import { magic } from "../../lib/magic";
import { ethers } from "ethers";
import { signInMessage, verifyAddress } from "../../lib/ethereum";

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
  };

  const loginBackend = async () => {

    // getting the end-users signer
    const _signer = provider?.getSigner();
    const signerAddress = await _signer?.getAddress();

    // sending the message for the end-user to sign
    const sig = await _signer?.signMessage(signInMessage);

    // const recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, sig!);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: signerAddress,
        sig
      })
    }).then((res) => res.json())
    console.log(res)
  };

  const makeRequest = async () => {
    const _signer = provider?.getSigner();
    // @ts-ignore
    fetch("/api/login", { method: "POST", body: _signer });
  };

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
      {renderAuth && (
        <>
          <button onClick={handleLogout}>Log out</button>
          <button className="block" onClick={loginBackend}>
            Auth backend
          </button>
        </>
      )}
    </>
  );
}
