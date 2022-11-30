import React, { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import AppLayout from "../../../layout/AppLayout";
import CreateLayout from "../../../layout/CreateLayout";
import CreateProcessLayout from "../../../layout/CreateProcessLayout";
import Spinner from "../../../components/Spinner/Spinner";
import { Button } from "../../../components/Button/Button";

const StepTwo: NextPageWithLayout<any> = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className="grow flex flex-col items-center gap-4 w-full">
      <Spinner success={success} error={error} />
      {error ? (
        <>
          <h3 className="text-center">Fail to receive fee</h3>
          <p className="text-center">
            {/* TODO: Change the ETH amount in the text */}
            We have difficulty receiving the creation fee. Make sure your wallet
            has at least 0.08 ETH before trying again
          </p>
          <Button className="w-[245px]">Initiate payment again</Button>
        </>
      ) : success ? (
        <>
          <h3 className="text-center">Creation fee received</h3>
          <p className="text-center">
            Next, we will create your club that allows you to raise fund and
            invest together with your friends
          </p>
        </>
      ) : (
        <>
          <h3 className="text-center">Receiving creation fee...</h3>
          <p className="text-center">
            If you do not receive a notification for payment, press the
            “Initiate payment again” button below
          </p>
          <Button variant="secondary" className="w-[245px]">
            Initiate payment again
          </Button>
        </>
      )}
    </div>
  );
};

StepTwo.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <CreateLayout>
        <CreateProcessLayout>{page}</CreateProcessLayout>
      </CreateLayout>
    </AppLayout>
  );
};

export default StepTwo;
