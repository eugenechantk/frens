import React, { ReactElement } from "react";
import AppLayout from "../../layout/AppLayout";
import { useRouter } from "next/router";
import { useAuth } from "../../lib/auth";
import { NextPageWithLayout } from "../_app";
import { Button } from "../../components/Button/Button";
import ClubCard from "../../components/ClubCard/ClubCard";
import nookies from "nookies";
import { adminAuth, adminFirestore} from "../../firebase/firebaseAdmin";
import { InferGetServerSidePropsType } from "next";
import NotAuthed from "../../components/NotAuthed/NotAuthed";
import { IClubInfo } from "./[id]";
import _ from "lodash";
import { getUserHoldings } from "../../lib/ethereum";
import { clearSignClients } from "../../lib/walletConnectLib";

interface IClubData extends IClubInfo {
  club_id: string;
}

export const getServerSideProps = async (context: any) => {
  // Step 0: get auth status of the user
  const cookies = nookies.get(context);
  if (!cookies.token) {
    return {
      props: {
        error: "user not authed",
      },
    };
  } else {
    try {
      // Step 1: Fetch all ERC20 token holdings of users
      const userAddress = await adminAuth
        .verifyIdToken(cookies.token)
        .then((decodedToken) => decodedToken.uid);
      // console.log(userAddress);
      const erc20Tokens = await getUserHoldings(userAddress)
      // console.log(erc20Tokens);

      // Step 2: query the club collection to find matching clubs with the same token address
      // for using in query, we need to make sure that each query only has 10 token addresses
      const balanceChunk = _.chunk(erc20Tokens, 10);
      // console.log(balanceChunk[0])
      let userClubs: IClubData[] = [];

      // querying all the clubs that matches with user's token holdings
      for await (const balances of balanceChunk) {
        // console.log(balances)
        const snapshot = await adminFirestore
          .collection("clubs")
          .where("club_token_address", "in", balances)
          .get();
        if (!snapshot.empty) {
          snapshot.forEach((doc) => {
            let clubInfo = doc.data()
            clubInfo['club_id'] = doc.id
            userClubs.push(clubInfo as IClubData)
          });
        }
      }
      // console.log(userClubs)
      return {
        props: {
          clubData: userClubs,
        },
      };
    } catch (err: any) {
      // console.log(err)
      return {
        props: {
          error: err.message,
        },
      };
    }
  }
};

const ClubList: NextPageWithLayout<any> = ({
  ...serverProps
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // console.log(serverProps);
  const user = useAuth();
  const router = useRouter();
  clearSignClients();
  return (
    <>
      {!serverProps.error ? (
        <div className="h-full w-full py-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col gap-6 md:gap-8 max-w-[1000px] mx-auto">
            {/* Title and create button for desktop */}
            <div className="flex flex-row items-start justify-between w-full">
              <h1>My clubs</h1>
              <Button
                className="w-[218px] hidden md:block"
                onClick={() => router.push("/create")}
              >
                <h3>Create new club</h3>
              </Button>
            </div>
            {/* Club cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full justify-items-center">
              {serverProps.clubData && (
                <>
                  {serverProps.clubData.map((club, index) => {
                    return (
                      <ClubCard
                        key={index}
                        clubName={club.club_name}
                        clubDes={club.club_description}
                        profileImgUrl={club.club_image!}
                        onClick={() => router.push(`/clubs/${club.club_id}`)}
                      />
                    );
                  })}
                  <Button
                    className="w-[218px] block md:hidden mb-6"
                    onClick={() => router.push("/create")}
                  >
                    <h3>Create new club</h3>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <NotAuthed />
      )}
    </>
  );
};

ClubList.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default ClubList;
