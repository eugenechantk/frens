import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AppLayout from "../../../app/clubs/AppLayout";
import { Button } from "../../../components/Button/Button";
import { useRouter } from "next/router";
import { InferGetServerSidePropsType } from "next";
import { adminFirestore } from "../../../firebase/firebaseAdmin";
import Image from "next/image";
import nookies from "nookies";
import NotAuthed from "../../../components/NotAuthed/NotAuthed";

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  const cookies = nookies.get(context);
  // console.log(id);
  if (!cookies.token) {
    return {
      props: {
        error: "user not authed",
      },
    };
  }
  // Step 1: fetch the information about this club
  try {
    const res = await adminFirestore
    .collection("clubs")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        throw new Error("club does not exist");
      }
      return doc.data();
    })
    return {
      props: {
        clubName: res!.club_name,
        profileImgUrl: res!.club_image,
      }
    }
  } catch (err: any) {
    return {
      props: {
        error: err.message
      }
    }
  }
};

const StepComplete: NextPageWithLayout<any> = (
  serverProps: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  // console.log(serverProps);
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      {!serverProps.error ? (
        <div className="flex flex-row items-center justify-center h-full w-full px-6">
          <div className="flex flex-col items-center justify-center gap-4 max-w-[480px]">
            <div className=" w-16 md:w-24 h-16 md:h-24 relative rounded-10 border-2 border-secondary-300 overflow-hidden">
              <Image
                src={serverProps.profileImgUrl}
                alt={`Profile image for ${serverProps.clubName}`}
                fill
                style={{'objectFit': 'cover'}}
              />
            </div>
            {/* TODO: render name of the club created */}
            <h3 className="text-center">Welcome to {serverProps.clubName}</h3>
            <p className="text-center">
              In your club, you can raise money from your friends and invest
              together in cryptocurrencies
            </p>
            <Button
              className="w-[245px]"
              onClick={() => router.push(`/clubs/${id}`)}
            >
              <h3>Go to club</h3>
            </Button>
          </div>
        </div>
      ) : (
        <NotAuthed />
      )}
    </>
  );
};

StepComplete.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default StepComplete;
