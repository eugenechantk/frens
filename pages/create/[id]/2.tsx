import React, { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import AppLayout from "../../../layout/AppLayout";
import CreateLayout from "../../../layout/CreateLayout";
import CreateProcessLayout from "../../../layout/CreateProcessLayout";
import Spinner from "../../../components/Spinner/Spinner";
import { Button } from "../../../components/Button/Button";
import { useRouter } from "next/router";
import axios from "axios";
import { provider } from "../../../lib/provider";
import { clientFireStore } from "../../../firebase/firebaseClient";
import { doc, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import { ethers } from "ethers";

const StepTwo: NextPageWithLayout<any> = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>();
  const router = useRouter();
  const clubId = router.query.id;

  useEffect(() => {
    initClubWallet();
  }, [router.query.id]);

  const initClubWallet = async () => {
    console.log("Initializing club wallet");
    setLoading(true);
    // Step 1: get the address of the club wallet
    await handleClubWalletCreate()
      // Step 2: send fee from the user wallet to the club wallet
      .then(async () => await sendFeeToClubWallet())
      // Step 3: change the deposited field of the club in DB to true
      .then(
        async () =>
          await updateDoc(doc(clientFireStore, "clubs", String(clubId)), {
            deposited: true,
          })
      )
      // Step 4: Redirect to next step
      .then(() => setTimeout(() => router.push(`/create/${clubId}/3`), 1500))
      .catch((err) => {
        setLoading(false);
        setError(err);
        // console.log(err);
      });
  };

  const handleClubWalletCreate = async () => {
    const data = await axios
      .post("/api/create/wallet", { clubId: clubId })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        setLoading(false);
        setSuccess(false);
        setError(err);
      });
    return { ...data };
  };

  const sendFeeToClubWallet = async () => {
    const _signer = await provider!.getSigner();

    // Get gas price, club wallet address, nonce of the user and user address
    const [_gasPrice, clubWalletAddress] = await Promise.allSettled([
      await provider?.getGasPrice(),
      await (
        await getDoc(doc(clientFireStore, "clubs", String(clubId)))
      ).data()!.club_wallet_address,
    ])
      .then((results) =>
        results.map((result) => {
          if (result.status === "fulfilled") {
            return result.value;
          } else {
            throw new Error(result.reason);
          }
        })
      )
      .catch((err) => {
        setLoading(false);
        setSuccess(false);
        setError(err);
        return [];
      });
    const userAddress = await _signer.getAddress();
    const _nonce = await provider?.getTransactionCount(userAddress, "latest");

    // put all info into a transaction object
    const tx = {
      from: userAddress,
      to: clubWalletAddress,
      value: ethers.utils.parseUnits(
        String(process.env.NEXT_PUBLIC_CLUB_DEPOSIT),
        "ether"
      ),
      gasPrice: _gasPrice,
      gasLimit: ethers.utils.hexlify(100000),
      nonce: _nonce,
    };
    // console.log(_gasPrice, _signer, clubWalletAddress, userAddress, _nonce);

    // send the transaction using user's wallet
    const transaction = await _signer.sendTransaction(tx);
    setLoading(false);
    setSuccess(true);
    setError({});
  };

  return (
    <div className="grow flex flex-col items-center gap-4 w-full">
      <Spinner success={success} error={error} />
      {success ? (
        <>
          <h3 className="text-center">Creation fee received</h3>
          <p className="text-center">
            Next, we will create your club that allows you to raise fund and
            invest together with your friends
          </p>
        </>
      ) : error ? (
        <>
          <h3 className="text-center">Fail to receive fee</h3>
          <p className="text-center">
            {/* TODO: Change the ETH amount in the text */}
            We have difficulty receiving the creation fee. Make sure your wallet
            has at least {process.env.NEXT_PUBLIC_CLUB_DEPOSIT} ETH before
            trying again
          </p>
          <Button
            className="w-[245px]"
            onClick={(e) => {
              e.preventDefault();
              initClubWallet();
            }}
            loading={loading}
          >
            <h3>Initiate payment again</h3>
          </Button>
        </>
      ) : (
        <>
          <h3 className="text-center">Receiving creation fee...</h3>
          <p className="text-center">
            If you do not receive a notification for payment in 30 seconds,
            press the “Initiate payment again” button below
          </p>
          <Button
            variant="secondary"
            className="w-[245px]"
            onClick={(e) => {
              e.preventDefault();
              initClubWallet();
            }}
          >
            <h3>Initiate payment again</h3>
          </Button>
        </>
      )}
    </div>
  );
};

StepTwo.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <CreateLayout>
        <CreateProcessLayout>{page}</CreateProcessLayout>
      </CreateLayout>
    </AppLayout>
  );
};

export default StepTwo;
