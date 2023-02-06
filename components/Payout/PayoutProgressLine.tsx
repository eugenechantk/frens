import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Wallet } from "ethers";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { clientFireStore } from "../../firebase/firebaseClient";
import { IHoldingsData, sendToken } from "../../lib/ethereum";
import { IClubInfo } from "../../lib/fetchers";
import { IMemberInfoAndClaimPower } from "../../pages/clubs/[id]/close";
import PayoutItem from "./PayoutItem";

export interface IOps {
  tokenInfo: string | IHoldingsData;
  status: "pending" | "done" | "in-progress";
  txnHash: string;
  error?: string;
}

enum OperationName {
  SPLIT = "Calculate members’ shares",
  SENDALL = "Initiate distribution",
  BURN = "Burn club tokens and close club",
}

export default function PayoutProgressLine({
  sdk,
  clubPorfolio,
  claimPower,
  clubInfo,
  clubWallet,
  setPayoutProgress,
}: {
  sdk: ThirdwebSDK;
  clubPorfolio: IHoldingsData[];
  claimPower: IMemberInfoAndClaimPower[];
  clubInfo: IClubInfo;
  clubWallet: Wallet;
  setPayoutProgress: Dispatch<
    SetStateAction<"not started" | "in progress" | "done">
  >;
}) {
  const router = useRouter();
  const { id } = router.query;
  // Initialize the operation queue
  let _ops: IOps[] = [
    { tokenInfo: OperationName.SPLIT, status: "pending", txnHash: "" },
    { tokenInfo: OperationName.SENDALL, status: "pending", txnHash: "" },
  ];
  clubPorfolio.forEach((token) =>
    _ops.push({ tokenInfo: token, status: "pending", txnHash: "" })
  );
  _ops.push({ tokenInfo: OperationName.BURN, status: "pending", txnHash: "" });
  const [ops, setOps] = useState<IOps[]>(_ops);

  const [splitContractAddress, setSplitContractAddress] = useState(
    clubInfo.split_contract_address
  );

  // Util functions to set the status of each step
  const setStatusToProgress = (ops: IOps[], step: number) => {
    let _ops = [...ops];
    _ops[step].status = "in-progress";
    setOps(_ops);
  };
  const setStatusToDone = (ops: IOps[], step: number) => {
    let _ops = [...ops];
    _ops[step].status = "done";
    setOps(_ops);
  };
  const setStatusToError = (ops: IOps[], step: number, error: any) => {
    let _ops = [...ops];
    _ops[step].error = error;
    setOps(_ops);
  };
  const setTxnSuccess = (ops: IOps[], step: number, txnHash: string) => {
    let _ops = [...ops];
    _ops[step].status = "done";
    _ops[step].txnHash = txnHash;
    setOps(_ops);
  };

  // Deploy split contract based on club member's token ownership
  const deploySplitContract = async () => {
    let splitContract = ""
    if (!splitContractAddress) {
      // STEP 1: calcualte the shares of each member + adding remainder to club wallet
      const _holderClaimPower = claimPower.map((member) => {
        return { address: member.uid, sharesBps: member.share };
      });
      const memberClaimPower = _holderClaimPower.reduce((acc, holder) => {
        return (acc += holder.sharesBps);
      }, 0);
      _holderClaimPower[0].sharesBps += (10000 - memberClaimPower)
      // STEP 2: Deploy the split contract
      const _splitContractAddress = await sdk.deployer.deploySplit({
        name: `${clubInfo.club_name} Split`,
        recipients: _holderClaimPower,
      });
      setSplitContractAddress(_splitContractAddress);
      console.log(
        "✅ Successfully deployed split contract, address:",
        _splitContractAddress
      );
      // STEP 3: add the split contract address to club record
      const updateClubRecord = await updateDoc(
        doc(clientFireStore, "clubs", String(id)),
        {
          split_contract_address: _splitContractAddress,
        }
      );
      splitContract = _splitContractAddress
    } else {
      splitContract = splitContractAddress
    }
    return splitContract
  };

  // Send all club assets to split contract
  const sendAllToSplit = async (splitContract: string) => {
    const _gasForDistribute = clubPorfolio.length * parseInt(process.env.NEXT_PUBLIC_SPLIT_GAS_LIMIT!);
    for (let token of clubPorfolio) {
      const result = await sendToken(
        splitContract,
        clubWallet,
        String(token.balance),
        String(token.token_address),
        _gasForDistribute
      );
      console.log(`Send ${token.name} to split contract success: ${result}`);
    }
    return splitContract
  };

  useEffect(() => {
    let step = 0;
    setStatusToProgress(ops, step);
    deploySplitContract()
      .then((splitContract) => {
        setStatusToDone(ops, step);
        step++;
        return splitContract
      })
      .then(async (splitContract) => {
        setStatusToProgress(ops, step);
        const _splitContract = await sendAllToSplit(splitContract);
        return _splitContract
      })
      .then((splitContract) => {
        setStatusToDone(ops, step);
        step++;
        return splitContract
      })
      .then(async (_splitContract) => {
        setStatusToProgress(ops, step);
        const splitContract = await sdk.getContract(
          _splitContract,
          "split"
        );
        // Splitting the tokens left
        for (let token of ops.slice(step, -1)) {
          setStatusToProgress(ops, step);
          if ((token.tokenInfo as IHoldingsData).token_address) {
            try {
              await splitContract
                .distributeToken(
                  (token.tokenInfo as IHoldingsData).token_address
                )
                .then((result) => {
                  setTxnSuccess(ops, step, result.receipt.transactionHash);
                  step++;
                });
            } catch (err) {
              throw err;
            }
          } else {
            try {
              await splitContract.distribute().then((result) => {
                setTxnSuccess(ops, step, result.receipt.transactionHash);
                step++;
              });
            } catch (err) {
              throw err;
            }
          }
        }
      })
      .then(() => {
        setStatusToDone(ops, step);
        setPayoutProgress("done");
      })
      .catch((err) => {
        setStatusToError(ops, step, err);
        console.log(err);
      });
  }, []);

  return (
    <div className="flex flex-col items-start gap-3 relative">
      {ops?.map((op, index) => (
        <PayoutItem
          key={index}
          token={op.tokenInfo}
          txnStatus={op.status}
          error={op.error}
          txnHash={op.txnHash}
        />
      ))}
      <div className="absolute w-[3px] bg-secondary-300 left-[10px] -z-10 h-[calc(100%-58px)]"></div>
    </div>
  );
}
