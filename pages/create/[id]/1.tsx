import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AppLayout from "../../../layout/AppLayout";
import CreateLayout from "../../../layout/CreateLayout";
import CreateProcessLayout from "../../../layout/CreateProcessLayout";
import FeeEstimate from "../../../components/FeeEstimate/FeeEstimate";
import { Button } from "../../../components/Button/Button";

const StepOne: NextPageWithLayout<any> = () => {
  return (
    <div className="grow flex flex-col items-center gap-4 w-full">
      <h3 className="text-center">Confirm creation fee</h3>
      <p className=" text-center">Make sure you have enough ETH in your wallet to cover the creation fee for your club</p>
      <FeeEstimate eth={0.0756} usd={12.37} className="w-5/6 md:min-w-[296px] min-w-full"/>
      <Button className="w-[218px]">Confirm and create</Button>
    </div>
  );
};

StepOne.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <CreateLayout>
        <CreateProcessLayout>
          {page}
        </CreateProcessLayout>
      </CreateLayout>
    </AppLayout>
  );
};

export default StepOne;
