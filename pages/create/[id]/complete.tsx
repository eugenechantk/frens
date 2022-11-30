import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AppLayout from "../../../layout/AppLayout";
import CreateLayout from "../../../layout/CreateLayout";

const StepComplete: NextPageWithLayout<any> = () => {
  return <>Creation completed</>;
};

StepComplete.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <CreateLayout>
        {page}
      </CreateLayout>
    </AppLayout>
  );
};

export default StepComplete;