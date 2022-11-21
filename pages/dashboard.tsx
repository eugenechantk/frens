import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React, { ReactElement } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { NextPageWithLayout } from "./_app";
import nookies from "nookies";
import { getAuth } from "firebase/auth";
import { firebaseClient } from "../firebase/firebaseClient";
import { firebaseAdmin } from "../firebase/firebaseAdmin";
import { useAuth } from "../lib/auth";

const Dashboard: NextPageWithLayout<any> = () => {
  const user = useAuth()
  return (
    <>{user.user ? user.user?.uid : 'Dashboard'}</>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;
