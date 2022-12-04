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
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { ethers } from "ethers";

const StepTwo: NextPageWithLayout<any> = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const createClubWallet = async () => {
      // Step 1: get the address of the club wallet
      const { address } = await handleClubWalletCreate();
      // Step 2: send fee from the user wallet to the club wallet
    };
    createClubWallet();
  }, [router.query.id]);

  const handleClubWalletCreate = async () => {
    const { id } = router.query;
    const data = await axios
      .post("/api/create/wallet", { clubId: id })
      .then((res) => {
        setSuccess(true);
        return res.data;
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      });
    return { ...data };
  };

  const sendFeeToClubWallet = async () => {
    const clubId = String(router.query.id);
    const [_gasPrice, signer, clubWalletAddress] = await Promise.allSettled([
      await provider?.getGasPrice(),
      await provider?.getSigner(),
      await (await getDoc(doc(clientFireStore, "clubs", clubId))).data()!
        .club_wallet_address,
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
        console.log(err);
        return [];
      });
    const userAddress = await signer.getAddress();
    const _nonce = await provider?.getTransactionCount(userAddress, 'latest');
    const tx = {
      from: userAddress,
      to: clubWalletAddress,
      value: ethers.utils.parseUnits('0.001', 'ether'),
      gasPrice: _gasPrice,
      gasLimit: ethers.utils.hexlify(100000),
      nonce: _nonce,
    }
    console.log(_gasPrice, signer, clubWalletAddress, userAddress, _nonce);
    try {
      const transaction = await signer.sendTransaction(tx);
      console.log(transaction);
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="grow flex flex-col items-center gap-4 w-full">
      <Spinner success={success} error={error} />
      {error ? (
        <>
          <h3 className="text-center">Fail to receive fee</h3>
          <p className="text-center">
            {/* TODO: Change the ETH amount in the text */}
            We have difficulty receiving the creation fee. Make sure your wallet
            has at least 0.08 ETH before trying again
          </p>
          <Button className="w-[245px]">
            <h3>Initiate payment again</h3>
          </Button>
        </>
      ) : success ? (
        <>
          <h3 className="text-center">Creation fee received</h3>
          <p className="text-center">
            Next, we will create your club that allows you to raise fund and
            invest together with your friends
          </p>
        </>
      ) : (
        <>
          <h3 className="text-center">Receiving creation fee...</h3>
          <p className="text-center">
            If you do not receive a notification for payment, press the
            “Initiate payment again” button below
          </p>
          <Button variant="secondary" className="w-[245px]">
            <h3>Initiate payment again</h3>
          </Button>
        </>
      )}
      <Button onClick={sendFeeToClubWallet}>
        <h3>Try sending transaction</h3>
      </Button>
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
