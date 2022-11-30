import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import AppLayout from "../../layout/AppLayout";
import CreateLayout from "../../layout/CreateLayout";

const CreateClub: NextPageWithLayout<any> = () => {
  return <>Create club</>;
};

CreateClub.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <CreateLayout>
        {page}
      </CreateLayout>
    </AppLayout>
  );
};

export default CreateClub;
