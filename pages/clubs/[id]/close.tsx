import { InferGetServerSidePropsType } from "next";
import { ReactElement, useState } from "react";
import AppLayout from "../../../layout/AppLayout";
import { NextPageWithLayout } from "../../_app";
import nookies from "nookies";
import { fetchClubInfo, IClubInfo } from "../../../lib/fetchers";
import Image from "next/image";
import OwnershipItem from "../../../components/Split/OwnershipItem";
import { Button } from "../../../components/Button/Button";
import { useRouter } from "next/router";
import PayoutProgressLine from "../../../components/Payout/PayoutProgressLine";
import NotAuthed from "../../../components/NotAuthed/NotAuthed";
import {
  getClubMemberBalance,
  getClaimPower,
  fetchPortfolio,
  initWallet,
  IHolderPower,
} from "../../../lib/ethereum";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { IMemberInfoData, serverPropsError } from ".";
import { adminAuth } from "../../../firebase/firebaseAdmin";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import ClubClosed from "../../../components/ClubClosed/ClubClosed";

export interface IMemberInfoAndClaimPower extends IMemberInfoData {
  share: number;
}

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  const cookies = nookies.get(context);

  if (!cookies.token) {
    return {
      props: {
        error: serverPropsError.NOT_AUTH,
      },
    };
  } else {
    try {
      // Get the club information for display and rendering
      const _clubInfo: IClubInfo = await fetchClubInfo(id);
      if (_clubInfo.closed) {
        return {
          props: {
            clubData: _clubInfo,
            error: serverPropsError.CLOSED,
          },
        };
      }
      // Get club portfolio and club members
      const [_clubPortfolio, _club_members] = await Promise.all([
        fetchPortfolio(_clubInfo.club_wallet_address!),
        getClubMemberBalance(_clubInfo, id),
      ]);
      // Get power of each member
      const _holderPower: IHolderPower[] = getClaimPower(
        _clubInfo,
        _club_members
      );
      console.log(_holderPower);

      let _claimPower = [] as IMemberInfoAndClaimPower[];
      await Promise.all(
        Object.keys(_club_members).map(async (uid) => {
          // console.log(uid)
          const _memberInfo = await adminAuth.getUser(uid);
          _claimPower.push({
            display_name: _memberInfo.displayName!,
            profile_image: _memberInfo.photoURL!,
            uid: _memberInfo.uid,
            share: _holderPower.filter((member) => member.address === uid)[0]
              .sharesBps,
          });
        })
      );
      return {
        props: {
          clubData: _clubInfo,
          clubPorfolio: _clubPortfolio,
          claimPower: _claimPower,
        },
      };
    } catch (err) {
      return {
        props: {
          error: JSON.parse(JSON.stringify(err)),
        },
      };
    }
  }
};

const CloseClub: NextPageWithLayout<any> = ({
  ...serverProps
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;
  const [payoutProgress, setPayoutProgress] =
    useState<"not started" | "in progress" | "done">("not started");

  // Initalize ThirdWebSDK with club wallet
  const clubWallet = initWallet(serverProps.clubData!.club_wallet_mnemonic!);
  const sdk = new ThirdwebSDK(clubWallet);

  return serverProps.error === "Not authed" ? (
    <NotAuthed />
  ) : serverProps.error && !(serverProps.error in serverPropsError) ? (
    <ErrorMessage />
  ) : (
    <div className="md:max-w-[1000px] w-full md:mx-auto px-4 pt-3 pb-5 h-full flex flex-col">
      <div className="flex flex-col gap-6 grow pb-4 md:flex-row md:items-center md:gap-10">
        {/* Description */}
        <div className="md:w-1/2">
          {/* Club title collapsed */}
          <div className="flex flex-row gap-3 mb-5">
            <div className="w-7 h-7 relative">
              <Image
                src={serverProps.clubData?.club_image!}
                alt="Club profile image"
                fill
                className="rounded-[4px]"
                style={{ objectFit: "cover" }}
              />
            </div>
            <h4 className="grow">{serverProps.clubData?.club_name}</h4>
          </div>
          <h3 className="mb-3">Close club and distribute fund</h3>
          <p className="mb-2">
            We will have to close the club from further buy in or investing
            before distributing the fund.
          </p>
          {payoutProgress === "not started" ? (
            <p>
              Please confirm the following before closing the club and
              distributing the fund.
            </p>
          ) : (
            payoutProgress === "in progress" && (
              <p className="bg-red-100 py-1 px-2 rounded-[4px] font-semibold text-error w-fit mt-4">
                Do not close this window
              </p>
            )
          )}
          {serverProps.error === serverPropsError.CLOSED && <ClubClosed/>}
        </div>
        {/* Split breakdown */}
        {!serverProps.error && (
          <div className="overflow-y-scroll md:w-1/2 grow">
            {payoutProgress === "not started" ? (
              <>
                <p className="mb-2 text-sm font-bold uppercase text-secondary-600">
                  Split breakdown
                </p>
                {/* For each member, show an ownership item */}
                {serverProps.claimPower?.map((memberPower, index) => (
                  <OwnershipItem
                    key={index}
                    member={memberPower}
                    clubPortfolio={serverProps.clubPorfolio}
                  />
                ))}
              </>
            ) : (
              <PayoutProgressLine
                sdk={sdk}
                clubPorfolio={serverProps.clubPorfolio!}
                claimPower={serverProps.claimPower!}
                setPayoutProgress={setPayoutProgress}
                clubInfo={serverProps.clubData!}
                clubWallet={clubWallet}
              />
            )}
          </div>
        )}
      </div>
      {/* Button group */}
      <div className="flex flex-col items-center gap-3 bg-secondary-100 mb-4">
        {!serverProps.error ? (
          payoutProgress === "not started" ? (
            <>
              <p className="bg-red-100 py-1 px-2 rounded-[4px] font-semibold text-error">
                Closing the club is irreversible
              </p>
              <Button
                className="!bg-error !border-none w-[312px] hover:!bg-red-600 active:!bg-red-700"
                onClick={() => setPayoutProgress("in progress")}
              >
                <h5>Close club and distribute</h5>
              </Button>
              <Button
                variant="secondary-outline"
                className="w-[312px]"
                onClick={() => router.push(`/clubs/${id}`)}
              >
                <h5>Go back</h5>
              </Button>
            </>
          ) : (
            payoutProgress === "done" && (
              <Button
                className="w-[218px]"
                onClick={() => router.push("/clubs")}
              >
                <h3>Back to my clubs</h3>
              </Button>
            )
          )
        ) : (
          <Button
            variant="secondary-outline"
            className="w-[312px]"
            onClick={() => router.push(`/clubs/${id}`)}
          >
            <h5>Go back</h5>
          </Button>
        )}
      </div>
    </div>
  );
};

CloseClub.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default CloseClub;
