import React, { ReactElement } from "react";
import AppLayout from "../../layout/AppLayout";
import { useRouter } from "next/router";
import { useAuth } from "../../lib/auth";
import { NextPageWithLayout } from "../_app";
import { Button } from "../../components/Button/Button";
import ClubCard from "../../components/ClubCard/ClubCard";
import nookies from "nookies";
import { firebaseAdmin } from "../../firebase/firebaseAdmin";
import { InferGetServerSidePropsType } from "next";
import NotAuthed from "../../components/NotAuthed/NotAuthed";
import { IClubInfo } from "./[id]";

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
      const user = await firebaseAdmin.auth().verifyIdToken(cookies.token).catch(() => {throw Error('user not authed')})
      const docSnap = await firebaseAdmin.firestore().collection('roles').doc(user.uid).get()
      if (!docSnap.exists) {
        throw Error('user is not in roles collection')
      }
      if (!docSnap.data()) {
        throw Error('clubs not found')
      }
      const _clubs = docSnap.data()!.clubs;
      const _fetchClubDataPromise = await Promise.allSettled(_clubs.map(async (clubId: string):Promise<IClubData> => {
        const clubData = await firebaseAdmin
          .firestore()
          .collection("clubs")
          .doc(clubId)
          .get()
          .then((doc) => {
            return doc.data() as IClubData;
          }).catch((err) => {throw err});
        console.log(clubData)
        return {
          ...clubData,
          club_id: clubId,
        }
      }));
      const response = (_fetchClubDataPromise.filter((res) => res.status === "fulfilled" && res.value !== undefined) as PromiseFulfilledResult<IClubData>[]).map((club) => club.value)
      return {
        props: {
          clubData: response
        }
      };
    } catch (err: any) {
      return {
        props: {
          error: err.message
        }
      }
    }
  }
};

const ClubList: NextPageWithLayout<any> = ({
  ...serverProps
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // console.log(serverProps);
  const user = useAuth();
  const router = useRouter();
  // console.log(user)
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
                        profileImgUrl={club.club_image}
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
