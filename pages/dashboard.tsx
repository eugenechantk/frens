import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React, { ReactElement } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { NextPageWithLayout } from "./_app";
import nookies from "nookies";
import { getAuth } from "firebase/auth";
import { firebaseClient } from "../firebase/initFirebase";
import { firebaseAdmin } from "../firebase/firebaseAdmin";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    // the user is authenticated!
    const { uid, email } = token;

    // FETCH STUFF HERE!! 🚀

    return {
      props: { authed: true },
    };
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page

    // return false for authed props
    return { props: { authed: false }};
  }
}

const Dashboard: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  return (
    <>
      {props.authed ? (
        <p>Logged in</p>
      ) : (
        <p>Not logged in</p>
      )}
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;
