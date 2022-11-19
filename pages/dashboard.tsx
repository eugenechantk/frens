import React, { ReactElement } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { NextPageWithLayout } from "./_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <>
      <p>Dashboard</p>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;
