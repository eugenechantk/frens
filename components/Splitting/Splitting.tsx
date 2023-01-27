import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { clientFireStore } from "../../firebase/firebaseClient";
import {
  fetchPortfolio,
  getClaimPower,
  getClubMemberBalance,
  initWallet,
  sendToken,
} from "../../lib/ethereum";
import { IClubInfo, IMemberInfoData } from "../../pages/clubs/[id]";
import { Button } from "../Button/Button";

export default function Splitting({
  data,
  id,
}: {
  data: IClubInfo;
  id: string;
}) {
  const [splitContractAddress, setSplitContractAddress] = useState(data.split_contract_address)
  // STEP 1: Initiate a ethers wallet based on club wallet mnemonic
  const clubWallet = initWallet(data.club_wallet_mnemonic!);
  console.log("Club wallet private key: ", clubWallet.privateKey);

  // STEP 2: Initiate a ThirdWebSDK with the club wallet
  const sdk = new ThirdwebSDK(clubWallet);

  // STEP 3: Deploy split contract based on club member's token ownership
  const deploySplitContract = async () => {
    // STEP 3.1: Get latest club member list
    const _club_members = await getClubMemberBalance(data, id);
    // STEP 3.2: calcualte the shares of each member
    const _holderClaimPower = getClaimPower(data, _club_members);
    // STEP 3.3: Deploy the split contract
    const _splitContractAddress = await sdk.deployer.deploySplit({
      name: `${data.club_name} Split`,
      recipients: _holderClaimPower,
    });
    setSplitContractAddress(_splitContractAddress)
    console.log(
      "✅ Successfully deployed split contract, address:",
      splitContractAddress
    );
    // STEP 3.4: add the split contract address to club record
    const updateClubRecord = await updateDoc(
      doc(clientFireStore, "clubs", id),
      {
        split_contract_address: splitContractAddress,
      }
    );
  };

  // STEP 4: Send all club assets to split contract
  const sendAllToSplit = async () => {
    if (!splitContractAddress) {
      return
    }
    const _walletBalance = await fetchPortfolio(data.club_wallet_address!)
    console.log(_walletBalance)
    const _gasForDistribute = _walletBalance.length * 250000;
    for (let token of _walletBalance) {
      await sendToken(
        splitContractAddress,
        clubWallet,
        String(token.balance),
        String(token.token_address),
        _gasForDistribute
      );
    }
  }

  // STEP 5: Split the assets back to club members
  const distributeSplit = async () => {
    const splitBalance = await fetchPortfolio(
      splitContractAddress!
    );
    const splitContract = await sdk.getContract(
      splitContractAddress!, "split"
    );
    for (let token of splitBalance) {
      if (token.token_address) {
        try {
          await splitContract
          .distributeToken(String(token.token_address))
          .then((result) => {
            console.log(result);
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          await splitContract.distribute().then((result) => {
            console.log(result);
          });
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  return (
    <div>
      <h3 className="mb-3">Splitting</h3>
      <Button className="w-[240px] mb-2" onClick={async () => deploySplitContract()}><h3>Deploy Split Contract</h3></Button>
      {splitContractAddress && <p className="mb-4">Split Contract Address: {splitContractAddress}</p>}
      <Button className="w-[240px] mb-4" onClick={async () => sendAllToSplit()}><h3>Transfer asset to split</h3></Button>
      <Button className="w-[240px] mb-4" onClick={async () => distributeSplit()}><h3>Split assets</h3></Button>
    </div>);
}
