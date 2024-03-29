import React, { lazy, ReactElement, Suspense, useState } from "react";
import AppLayout from "../../../layout/AppLayout";
import { NextPageWithLayout } from "../../_app";
import { adminAuth, adminFirestore } from "../../../firebase/firebaseAdmin";
import { InferGetServerSidePropsType } from "next";
import ClubDetails from "../../../components/ClubDetails/ClubDetails";
import ClubMembers from "../../../components/ClubMembers/ClubMembers";
import Portfolio from "../../../components/Portfolio/Portfolio";
import _ from "lodash";
import nookies from "nookies";
import NotAuthed from "../../../components/NotAuthed/NotAuthed";
import {
  fetchPortfolio,
  getClubMemberBalance,
  getLatestBlockNumber,
  IHoldingsData,
  initWallet,
  verifyClubHolding,
} from "../../../lib/ethereum";
import { useRouter } from "next/router";
import LoadingWidget from "../../../components/Widgets/LoadingWidget";
import { Button } from "../../../components/Button/Button";
import { Modal } from "@nextui-org/react";
import { Square2StackIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import { fetchClubInfo, IClubInfo } from "../../../lib/fetchers";
import ClubClosed from "../../../components/ClubClosed/ClubClosed";
import { redis } from "../../../lib/redis";
import { provider } from "../../../lib/provider";
const WidgetSection = lazy(
  () => import("../../../components/Widgets/WidgetSection")
);
const BuyInWidgetWrapper = lazy(
  () => import("../../../components/Widgets/BuyInWidget/BuyInWidgetWrapper")
);
export interface IMemberInfoData {
  display_name: string;
  profile_image: string;
  uid: string;
}

interface ITransferEvent {
  transaction_hash: string;
  address: string;
  block_timestamp: string;
  block_number: string;
  block_hash: string;
  to_address: string;
  from_address: string;
  value: string;
  transaction_index: number;
  log_index: number;
}

export enum serverPropsError {
  NOT_AUTH,
  NOT_VERIFIED,
  CLOSED,
}

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  const cookies = nookies.get(context);
  // console.log(cookies)
  // console.log(id);

  // Fetcher function for club members
  const fetchMemberInfo = async (
    clubInfo: IClubInfo
  ): Promise<IMemberInfoData[]> => {
    // STEP 1: Fetch the latest club member list
    const _club_members = await getClubMemberBalance(clubInfo);

    // STEP 2: Update the club member list
    const currentBlock = await getLatestBlockNumber();
    const result = adminFirestore.collection("clubs").doc(id).update({
      club_members: _club_members,
      last_retrieved_block: currentBlock,
    });

    // STEP 3: Fetch club members info by the updated club member list
    let memberInfo = [] as IMemberInfoData[];
    await Promise.all(
      Object.keys(_club_members).map(async (uid) => {
        // console.log(uid)
        const _memberInfo = await adminAuth.getUser(uid);
        memberInfo.push({
          display_name: _memberInfo.displayName!,
          profile_image: _memberInfo.photoURL!,
          uid: _memberInfo.uid,
        });
      })
    );
    return memberInfo;
  };

  if (!cookies.token) {
    return {
      props: {
        error: serverPropsError.NOT_AUTH,
      },
    };
  } else {
    try {
      // Prereq: get user address and club info
      const userAddress = await adminAuth
        .verifyIdToken(cookies.token)
        .then((decodedToken) => decodedToken.uid);
      // console.log(userAddress)
      const clubInfo: IClubInfo = await fetchClubInfo(id);

      // Step 1: See if the club is closed
      if (clubInfo.closed) {
        return {
          props: {
            clubInfo: clubInfo,
            error: serverPropsError.CLOSED,
          },
        };
      }
      // Step 2: Check if the user has club tokens to access this club
      const [decodedToken, tokenAddress] = await Promise.all([
        await adminAuth.verifyIdToken(cookies.token),
        await redis.hget<string>(id, "token_address"),
      ]);
      const verify = await verifyClubHolding(decodedToken.uid, tokenAddress!);
      // console.log(verify);
      if (!verify) {
        return {
          props: {
            clubInfo: clubInfo,
            error: serverPropsError.NOT_VERIFIED,
          },
        };
      }

      // Step 3: Fetch porfolio of the club
      const balance: IHoldingsData[] = await fetchPortfolio(
        clubInfo.club_wallet_address!
      );

      // Step 4: fetch club members
      let memberInfo = [] as IMemberInfoData[];
      try {
        memberInfo = await fetchMemberInfo(clubInfo);
      } catch (err) {
        console.log(err);
      }

      // // FOR TESTING ONLY
      // const clubWallet = initWallet(clubInfo.club_wallet_mnemonic!)
      // console.log(`Club wallet private key: ${clubWallet.privateKey}`);

      return {
        props: {
          clubInfo: clubInfo,
          balance: balance,
          members: memberInfo,
        },
      };
    } catch (err) {
      console.log(err);
      return {
        props: {
          error: JSON.parse(JSON.stringify(err)),
        },
      };
    }
  }
};

const Dashboard: NextPageWithLayout<any> = ({
  ...serverProps
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [copyLinkTooltip, setCopyLinkTooltip] = useState(false);

  const invitePath =
    typeof window !== "undefined"
      ? `${window.location.origin}${router.asPath}`
      : "";

  const copyLink = () => {
    setCopyLinkTooltip(true);
    navigator.clipboard.writeText(invitePath);
    setTimeout(() => setCopyLinkTooltip(false), 1000);
  };

  return (
    <>
      {serverProps.error === serverPropsError.NOT_AUTH ? (
        <NotAuthed />
      ) : serverProps.error && !(serverProps.error in serverPropsError) ? (
        <ErrorMessage err={serverProps.error} />
      ) : (
        <div className="md:max-w-[1000px] w-full md:mx-auto px-4 pt-3 md:pt-12 pb-5 h-full md:flex md:flex-row md:items-start md:gap-6 flex flex-col gap-8">
          {/* Left panel */}
          <div
            className={clsx(
              "flex flex-col items-start gap-8 w-full md:h-full",
              serverProps.error === serverPropsError.NOT_VERIFIED &&
                "md:w-1/2 md:justify-center"
            )}
          >
            {/* Club details and members */}
            <div className="flex flex-col items-start gap-4 w-full">
              <ClubDetails
                data={serverProps.clubInfo!}
                verified={serverProps.error !== serverPropsError.NOT_VERIFIED}
              />
              {!serverProps.error && (
                <div className="flex flex-row gap-2">
                  <ClubMembers data={serverProps.members!} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInviteModalOpen(true)}
                  >
                    <h4>Invite</h4>
                  </Button>
                </div>
              )}
            </div>
            {/* Balance */}
            {/* TODO: have a global state setting for whether to show club or me balance */}
            {/* {serverProps.error !== "user not verified" && <ClubBalance />} */}
            {/* Portfolio */}
            {!serverProps.error && (
              <Portfolio
                data={serverProps.balance!}
                clubWalletAddress={serverProps.clubInfo?.club_wallet_address!}
              />
            )}
            {serverProps.error === serverPropsError.CLOSED && <ClubClosed />}
          </div>
          {/* Right panel */}
          <div
            className={clsx(
              "flex flex-col gap-5 md:h-full",
              serverProps.error === serverPropsError.NOT_VERIFIED &&
                "md:w-1/2 md:justify-center"
            )}
          >
            {!serverProps.error && (
              <Suspense fallback={<LoadingWidget />}>
                <WidgetSection data={serverProps.clubInfo!} />
              </Suspense>
            )}
            {serverProps.error === serverPropsError.NOT_VERIFIED && (
              <Suspense>
                <BuyInWidgetWrapper data={serverProps.clubInfo!} notVerify />
              </Suspense>
            )}
            {/* FOR TESTING SPLITTING */}
            {/* {serverProps.error !== "user not verified" && (
            <Splitting data={serverProps.clubInfo!} id={String(id)} />
            )} */}
            {!serverProps.error && (
              <Button
                variant="secondary-outline"
                onClick={() => router.push(`/clubs/${id}/close`)}
              >
                <h3>Close club and distribute</h3>
              </Button>
            )}
          </div>
        </div>
      )}
      <Modal open={inviteModalOpen} onClose={() => setInviteModalOpen(false)}>
        <Modal.Header
          css={{
            marginTop: "8px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
          }}
        >
          <h3>Invite new members</h3>
        </Modal.Header>
        <Modal.Body css={{ marginBottom: "8px" }}>
          <div className="flex flex-col gap-4">
            <p className="text-gray-800">
              Share this link with others so they can deposit ETH and join your
              club
            </p>
            <div className="flex flex-row gap-1 px-5 py-4 rounded-[6px] border border-secondary-300 items-center">
              <p className="grow overflow-ellipsis overflow-hidden">
                {invitePath}
              </p>
              <div className="relative">
                <Button variant="text-only" onClick={copyLink}>
                  <Square2StackIcon className="w-5" />
                </Button>
                {copyLinkTooltip && (
                  <p className="absolute -top-8 -left-20 z-10 w-[138px] bg-gray-800 bg-opacity-80 px-3 py-1 rounded-[4px] text-white text-sm">
                    Copied invite link
                  </p>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Dashboard;
