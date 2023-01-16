import React, { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import AppLayout from "../../../layout/AppLayout";
import CreateLayout from "../../../layout/CreateLayout";
import CreateProcessLayout from "../../../layout/CreateProcessLayout";
import Spinner from "../../../components/Spinner/Spinner";
import { Button } from "../../../components/Button/Button";
import { useRouter } from "next/router";
import nookies from "nookies";
import { InferGetServerSidePropsType } from "next";
import NotAuthed from "../../../components/NotAuthed/NotAuthed";
import { IClubInfo } from "../../clubs/[id]";
import { clientFireStore } from "../../../firebase/firebaseClient";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ethers } from "ethers";
import { getChainData } from "../../../lib/chains";
import { ClaimConditionInput, ThirdwebSDK } from "@thirdweb-dev/sdk";

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

const StepThree: NextPageWithLayout<any> = ({
  ...serverProps
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>();
  const router = useRouter();
  const { id } = router.query;

  const initialClaimCondition: ClaimConditionInput[] = [
    {
      startTime: new Date(),
      price: parseFloat(process.env.NEXT_PUBLIC_CLAIM_ETH_PRICE!),
    },
  ];

  const handleTokenCreation = async () => {
    setError(null);
    setSuccess(false);
    try {
      const clubDocRef = doc(clientFireStore, "clubs", String(id));
      const clubInfo = await getDoc(clubDocRef).then(
        (doc) => doc.data() as IClubInfo
      );
      // console.log(clubInfo);

      // Step 1: Initiate a ethers wallet based on club wallet mnemonic
      const path = `${process.env.NEXT_PUBLIC_ETH_STANDARD_PATH}/${process.env.NEXT_PUBLIC_DEFAULT_ACTIVE_INDEX}`;
      const chainId = parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!);
      const provider = new ethers.providers.JsonRpcProvider(
        getChainData(chainId).rpc_url
      );
      const clubWallet = ethers.Wallet.fromMnemonic(
        clubInfo.club_wallet_mnemonic!,
        path
      ).connect(provider);
      // console.log("Club wallet private key: ", clubWallet.privateKey);

      // Step 2: Initiate a ThirdWebSDK with the club wallet
      const sdk = new ThirdwebSDK(clubWallet);
      const address = await sdk.getSigner()!.getAddress();
      // console.log("SDK is initiated using address: ", address);

      // Step 3: Deploy a token drop contract for the club
      const clubTokenContractAddress = await sdk.deployer.deployTokenDrop({
        name: clubInfo.club_name,
        primary_sale_recipient: address,
        description: clubInfo.club_description,
        symbol: clubInfo.club_token_sym,
        image: clubInfo.club_image,
      });
      // console.log(
      //   "✅ Successfully deployed token module, address:",
      //   clubTokenContractAddress
      // );

      // Step 4: set initial claim condition for the club token
      const clubTokenContract = sdk.getContract(clubTokenContractAddress!);
      await (
        await clubTokenContract
      ).erc20.claimConditions.set(initialClaimCondition);
      // console.log("Claim condition set for: ", clubTokenContractAddress));

      // Step 5: add the club token address to the club record for future use
      await updateDoc(clubDocRef, {
        club_token_address: clubTokenContractAddress,
      });
      // console.log('Club token address updated to: ',clubTokenContractAddress);

      setSuccess(true);
      setTimeout(() => router.push(`/create/${id}/complete`), 1500);
    } catch (err) {
      // console.log(err);
      setError(err);
    }
  };
  useEffect(() => {
    handleTokenCreation();
  }, []);

  return (
    <>
      {!serverProps.error ? (
        <div className="grow flex flex-col items-center gap-4 w-full">
          <Spinner success={success} error={error} />
          {success ? (
            <>
              <h3 className="text-center">Your club is created!</h3>
              <p className="text-center">
                We will redirect you to your club in a few seconds. Get ready...
              </p>
            </>
          ) : error ? (
            <>
              <h3 className="text-center">Fail to create club</h3>
              <p className="text-center">
                We have received the creation fee but have difficulty creating
                the club. You can try creating your club again.
              </p>
              <Button className="w-[245px]" onClick={handleTokenCreation}>
                <h3>Create club again</h3>
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-center">Creating your club...</h3>
              <p className="text-center">
                This will take a few minutes. Do not close this window
              </p>
            </>
          )}
        </div>
      ) : (
        <NotAuthed />
      )}
    </>
  );
};

StepThree.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <CreateLayout>
        <CreateProcessLayout>{page}</CreateProcessLayout>
      </CreateLayout>
    </AppLayout>
  );
};

export default StepThree;
