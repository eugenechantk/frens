import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React, { ReactElement } from "react";
import AppLayout from "../layout/AppLayout";
import { NextPageWithLayout } from "./_app";
import nookies from "nookies";
import { getAuth } from "firebase/auth";
import { firebaseClient } from "../firebase/firebaseClient";
import { firebaseAdmin } from "../firebase/firebaseAdmin";
import { useAuth } from "../lib/auth";
import { useRouter } from "next/router";
import { Button } from "../components/Button/Button";

const Dashboard: NextPageWithLayout<any> = () => {
  const user = useAuth()
  const router = useRouter();
  // console.log(user && user.user)
  return (
    <>
      <p>{user.user ? user.user?.uid : 'Dashboard'}</p>
      {user.user && (
        <>
          <p>Signed up: {user.user.metadata.creationTime}</p>
          <p>Last login: {user.user.metadata.lastSignInTime}</p>
          <Button className="mt-2" onClick={() => router.push('/create')}><h3>Go to create</h3></Button>
        </>
      )}
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Dashboard;
