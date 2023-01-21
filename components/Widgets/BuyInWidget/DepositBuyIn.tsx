import React, { useState } from "react";
import { Button } from "../../Button/Button";
import Spinner from "../../Spinner/Spinner";

export default function DepositBuyIn() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>();
  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-4 items-center h-full">
        <div className="flex flex-col gap-4 items-center justify-center grow">
          <Spinner success={success} error={error} />
          {error ? (
            <>
              <h3>Fail to deposit</h3>
              <p className="text-center px-10 md:px-3">
                We are unable to process your deposit. Please try again to
                deposit fund to the club
              </p>
            </>
          ) : success ? (
            <>
              <h3>Deposit success</h3>
              <p className="text-center px-10 md:px-3">
                You have successfully deposited fund to the club. Welcome
              </p>
            </>
          ) : (
            <>
              <h3>Depositing to club...</h3>
              <p className="text-center px-10 md:px-3">
                If you do not receive a notification for payment, press the
                “initiate deposit again” button below
              </p>
            </>
          )}
        </div>
        {error ? (
          <Button className="w-[245px]">
            <h3>Try again</h3>
          </Button>
        ) : success ? (
          <Button className="w-[245px]">
            <h3>Done</h3>
          </Button>
        ) : (
          <Button className="w-[245px]" variant="secondary">
            <h3>Initiate deposit again</h3>
          </Button>
        )}
      </div>
    </div>
  );
}
