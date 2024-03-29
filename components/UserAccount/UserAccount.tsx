import { Square2StackIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import AccountButton from "./AccountButton";
import { Button } from "../Button/Button";
import OutsideClickHandler from "react-outside-click-handler";
import { useAuth } from "../../lib/auth";
import { magic } from "../../lib/magic";
import { signOut } from "firebase/auth";
import { firebaseClientAuth } from "../../firebase/firebaseClient";
import defaultProfilePic from '../../public/default_avatar.png'
import { StaticImageData } from "next/image";
import { useRouter } from "next/router";

export default function UserAccount() {
  const { user } = useAuth();
  const [expand, setExpand] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [profilePicUrl, setProfilePicUrl] = useState<string | StaticImageData>(defaultProfilePic);
  const [tooltip, setTooltip] = useState("Copy wallet address");
  const router = useRouter(); 

  useEffect(() => {
    if (user) {
      setWalletAddress(user.uid);
      if (user.photoURL) {
        setProfilePicUrl(user.photoURL!);
      }
    }
  }, [user])

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress.toString());
    setTooltip("Copied address!");
    setTimeout(() => setTooltip("Copy wallet address"), 1500);
  };

  const handleLogout = async () => {
    await signOut(firebaseClientAuth).then(async () => {
      try {
        await magic?.connect.disconnect();
      } catch (err) {
        throw err;
      }
      setExpand(false);
      router.replace({ pathname: router.pathname, query: router.query })
    });
  };

  const handleWallet = () => {
    magic?.connect.showWallet();
    setTimeout(() => setExpand(false), 1000)
  }

  const toggleExpandAccoutBtn = (e: any) => {
    e.preventDefault();
    if (user) {
      setExpand(!expand);
    }
  };
  return (
    <OutsideClickHandler onOutsideClick={() => setExpand(false)}>
      <main className="relative">
        <div suppressHydrationWarning={true}>
          {typeof window != undefined ? (
            <AccountButton onClick={toggleExpandAccoutBtn} profilePicUrl={profilePicUrl}/>
          ) : null}
        </div>
        {user && expand && (
          <div
            className="
          absolute -left-[209px] top-[46px]
          flex flex-col items-start p-6 gap-4 
          border border-secondary-300 
          bg-secondary-200 
          rounded-20 w-[279px] z-10"
          >
            <div className="flex flex-col items-start gap-0">
              <p className=" text-sm font-bold text-secondary-600 uppercase">
                Your account
              </p>
              <button
                id="wallet_address"
                className="flex flex-row gap-1 items-center p-1 rounded-8 hover:bg-secondary-300"
                data-for="copyAddressTooltip"
                data-tip="Copy wallet address"
                onClick={copyAddress}
              >
                <span>
                  <h3 className="inline text-gray-400 font-medium">
                    {walletAddress.slice(0, 2)}
                  </h3>
                  <h3 className="inline text-gray-800 font-medium">
                    {walletAddress.slice(2, 8)}...{walletAddress.slice(-6)}
                  </h3>
                </span>
                <Square2StackIcon className="inline w-5 text-gray-400" />
              </button>
            </div>
            <div className="flex flex-col items-start gap-1 w-full">
              <Button variant="secondary" className="w-full" onClick={handleWallet}>
                <h5>Show wallet</h5>
              </Button>
              {/* TODO: implement profile page for v1
              <Button variant="secondary" className="w-full">
                <h5>Edit profile</h5>
              </Button> */}
            </div>
            <Button className="w-full" onClick={handleLogout}>
              <h5>Log out</h5>
            </Button>
          </div>
        )}
      </main>
    </OutsideClickHandler>
  );
}
