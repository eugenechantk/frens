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

export const getServerSideProps = async (context: any) => {
  // Step 0: get auth status of the user
  const cookies = nookies.get(context);
  const clubs = await firebaseAdmin
    .auth()
    .verifyIdToken(cookies.token)
    .then(async (user) => {
      const clubs = await firebaseAdmin
        .firestore()
        .collection("roles")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            return {
              props: null,
            };
          }
          return doc.data();
        })
        .then((data) => {
          if (!data) {
            return {
              props: {
                clubData: null,
              },
            };
          }
          return data.clubs;
        })
        // Step 2: get all the club data
        .then(async (clubs) => {
          if (!clubs) {
            return {
              props: {
                clubData: null,
              },
            };
          }
          const clubInfo = await Promise.allSettled(
            clubs.map(async (clubId: string) => {
              const clubData = await firebaseAdmin
                .firestore()
                .collection("clubs")
                .doc(clubId)
                .get()
                .then((doc) => {
                  return doc.data();
                });
              return {
                club_id: clubId,
                ...clubData,
              };
            })
          );
          // console.log(clubInfo);
          const filtered = clubInfo.filter((club) => {
            return club.status === "fulfilled" && club.value !== undefined;
          });
          return {
            props: {
              clubData: filtered.map((club) => {
                // @ts-ignore
                return club.value;
              }),
            },
          };
        })
        .catch((err) => {
          console.log(err);
          return {
            props: {
              clubData: null,
            },
          };
        });
      return { ...clubs };
    })
    .catch((err) => {
      console.log(err);
      return {
        props: {
          clubData: null,
        },
      };
    });
  // console.log(user);
  // Step 1: get all clubs that belongs to the user

  console.log(clubs);
  return { ...clubs };
};

const ClubList: NextPageWithLayout<any> = (
  serverProps: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  // console.log(serverProps)
  const user = useAuth();
  const router = useRouter();
  // console.log(user)
  return (
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
  );
};

ClubList.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default ClubList;
