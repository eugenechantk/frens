import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AppLayout from "../../../layout/AppLayout";
import CreateLayout from "../../../layout/CreateLayout";

const StepThree: NextPageWithLayout<any> = () => {
  return <>Step 3</>;
};

StepThree.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <CreateLayout>
        {page}
      </CreateLayout>
    </AppLayout>
  );
};

export default StepThree;