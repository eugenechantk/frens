import { TokenDrop } from "@thirdweb-dev/sdk";
import React, { useEffect, useState } from "react";
import { provider } from "../../../lib/provider";
import { Button } from "../../Button/Button";
import Spinner from "../../Spinner/Spinner";

export default function DepositBuyIn({
  tokenContract,
  claimAmount,
  onClick,
}: {
  tokenContract: TokenDrop | undefined;
  claimAmount: number;
  onClick: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>();
  const [transactionHash, setTransactionHash] = useState<string>("");

  const claim = async () => {
    setError(undefined)
    setSuccess(false)
    setLoading(true)
    try {
      const claimResult = await tokenContract!.claim(claimAmount);
      setTransactionHash(claimResult.receipt.transactionHash);
    } catch (err) {
      console.log(err)
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    claim();
  }, []);

  useEffect(() => {
    provider?.removeAllListeners();
    if (transactionHash) {
      // console.log('transaction pending')
      provider?.on(transactionHash, (transaction) => {
        setLoading(false);
        setSuccess(true);
        setError(undefined);
        provider?.removeAllListeners();
      });
    }
  }, [transactionHash]);

  return (
    <div className="w-full grow flex">
      <div className="flex flex-col gap-4 items-center grow">
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
                If you do not receive a notification for payment in 30 seconds, press the  button below
              </p>
            </>
          )}
        </div>
        {error ? (
          <Button
            className="w-[245px]"
            onClick={() => {
              claim();
            }}
          >
            <h3>Try again</h3>
          </Button>
        ) : success ? (
          <Button className="w-[245px]" onClick={onClick}>
            <h3>Done</h3>
          </Button>
        ) : (
          <Button
            className="w-[245px]"
            variant="secondary"
            onClick={() => {
              claim();
            }}
          >
            <h3>Initiate deposit again</h3>
          </Button>
        )}
      </div>
    </div>
  );
}
