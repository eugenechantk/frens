import React, { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import AppLayout from "../../../app/clubs/AppLayout";
import CreateLayout from "../../../layout/CreateLayout";
import CreateProcessLayout from "../../../layout/CreateProcessLayout";
import Spinner from "../../../components/Spinner/Spinner";
import { Button } from "../../../components/Button/Button";
import { useRouter } from "next/router";
import axios from "axios";
import { provider } from "../../../lib/provider";
import { clientFireStore } from "../../../firebase/firebaseClient";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ethers } from "ethers";
import nookies from "nookies";
import { InferGetServerSidePropsType } from "next";
import NotAuthed from "../../../components/NotAuthed/NotAuthed";
import { useAuth } from "../../../lib/auth";

export const getServerSideProps = async (context: any) => {
  const cookies = nookies.get(context);
  if (!cookies.token) {
    return {
      props: {
        error: "user not authed",
      },
    };
  } else {
    return {
      props: {},
    };
  }
};

const StepTwo: NextPageWithLayout<any> = ({
  ...serverProps
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [error, setError] = useState<any>();
  const router = useRouter();
  const clubId = router.query.id;
  const user = useAuth();

  useEffect(() => {
    initClubWallet();
  }, [router.query.id]);

  const initClubWallet = async () => {
    // console.log("Initializing club wallet");
    setTransactionHash("")
    setError(null);
    setLoading(true);
    try {
      // Step 1: get the address of the club wallet
      const getAddress = await handleClubWalletCreate();
      // Step 2: send fee from the user wallet to the club wallet
      const getWallet = await sendFeeToClubWallet();
    } catch (err) {
      setLoading(false);
      setSuccess(false);
      setError(err);
    }
  };

  const handleClubWalletCreate = async () => {
    const data = await axios
      .post("/api/create/wallet", { clubId: clubId }, {headers: {
        "authorization": 'Bearer ' + await user.user?.getIdToken(),
        "content-type": 'application/json'
      }})
      .then((res) => {
        return res.data;
      })
    return { ...data };
  };

  const sendFeeToClubWallet = async () => {
    const _signer = await provider!.getSigner();

    // Get gas price, club wallet address, nonce of the user and user address
    const [_gasPrice, clubWalletAddress] = await Promise.allSettled([
      (await provider?.getFeeData()!).maxFeePerGas,
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
    const _transaction: ethers.providers.TransactionResponse =
      await _signer.sendTransaction(tx);

    setTransactionHash(_transaction.hash);
  };

  // Only move on if the deposit is in the club wallet
  useEffect(() => {
    provider?.removeAllListeners()
    if (transactionHash) {
      // console.log('transaction pending')
      provider?.on(transactionHash, async (transaction) => {
        // console.log(transaction);
        setLoading(false);
        setSuccess(true);
        setError({});
        await updateDoc(doc(clientFireStore, "clubs", String(clubId)), {
          deposited: true,
        });
        provider?.removeAllListeners();
        setTimeout(() => router.push(`/create/${clubId}/3`), 1500);
      });
    }
  }, [transactionHash]);

  return (
    <>
      {!serverProps.error ? (
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
                We have difficulty receiving the creation fee. Make sure your
                wallet has at least {process.env.NEXT_PUBLIC_CLUB_DEPOSIT} ETH
                before trying again
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
      ) : (
        <NotAuthed />
      )}
    </>
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
