import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AppLayout from "../../../layout/AppLayout";
import CreateLayout from "../../../layout/CreateLayout";

const StepTwo: NextPageWithLayout<any> = () => {
  return <>Step 2</>;
};

StepTwo.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <CreateLayout>
        {page}
      </CreateLayout>
    </AppLayout>
  );
};

export default StepTwo;