import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import { Button } from "../Button/Button";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { getSigner, provider, signer } from "../../lib/provider";
import { signInMessage } from "../../lib/ethereum";
import { signInWithCustomToken } from "firebase/auth";
import { firebaseClientAuth } from "../../firebase/firebaseClient";
import { useAuth } from "../../lib/auth";
import { useRouter } from "next/router";

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
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    let sig, address;
    try {
      await provider!.send("eth_accounts", []);
    } catch (err) {
      console.log(err);
      setLoading(false);
      return;
    }

    try {
      // getting the end-users signer
      getSigner();
      // console.log(signer)
      address = await signer.getAddress();

      // sending the message for the end-user to sign
      sig = await signer.signMessage(signInMessage);
    } catch (err) {
      console.log(err);
      setLoading(false);
      return;
    }

    // const recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, sig!);
    const { token } = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        sig,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        return;
      });
    try {
      await signInWithCustomToken(firebaseClientAuth, token);
      setLoading(false);
      router.replace({ pathname: router.pathname, query: router.query })
    } catch (err) {
      console.log(err);
      setLoading(false);
      return;
    }
  };

  return (
    <Button
      variant="secondary-outline"
      className="w-[70px] h-[38px] px-1"
      onClick={user ? onClick : handleLogin}
      loading={loading}
      spinnerColor="#948669"
      id="account-button"
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
