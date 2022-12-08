import React, { ReactElement } from "react";
import AppLayout from "../../../layout/AppLayout";
import { NextPageWithLayout } from "../../_app";
import { useAuth } from "../../../lib/auth";
import { useRouter } from "next/router";
import { firebaseAdmin } from "../../../firebase/firebaseAdmin";
import { InferGetServerSidePropsType } from "next";

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  const clubInfo = await firebaseAdmin
    .firestore()
    .collection("clubs")
    .doc(id)
    .get()
    .then((doc) => {
      if(!doc.exists) {
        return {
          notFound: true,
        };
      }
      return doc.data()
    }).then((data) => {
      return {
        props: {
          ...data
        }
      }
    }).catch((err) => {
      console.log(err);
      return {
        notFound: true,
      }; 
    });
  return {
    ...clubInfo
  };
};

const Dashboard: NextPageWithLayout<any> = (serverProps: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(serverProps)
  const user = useAuth();
  const router = useRouter();
  // console.log(user && user.user)
  return (
    <div className="h-full w-full py-8 px-4">
      <h3>{serverProps.club_name}</h3>
      <p>{serverProps.club_description}</p>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Dashboard;
