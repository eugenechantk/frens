import React, { ReactElement } from "react";
import AppLayout from "../../../layout/AppLayout";
import { NextPageWithLayout } from "../../_app";
import { useAuth } from "../../../lib/auth";
import { useRouter } from "next/router";
import { Button } from "../../../components/Button/Button";

const Dashboard: NextPageWithLayout<any> = () => {
  const user = useAuth()
  const router = useRouter();
  // console.log(user && user.user)
  return (
    <div className="h-full w-full py-8 px-4">
      <p>Dashboard
      </p>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Dashboard;
