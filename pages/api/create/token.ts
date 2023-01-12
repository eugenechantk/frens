import { ThirdwebSDK, ClaimConditionInput } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { adminFirestore } from "../../../firebase/firebaseAdmin";
import { getChainData } from "../../../lib/chains";
import { IClubInfo } from "../../clubs/[id]";

interface ITokenApiRequest extends NextApiRequest {
  body: {
    clubId: string;
  };
}

const initialClaimCondition: ClaimConditionInput[] = [
  {
    startTime: new Date(),
    price: parseFloat(process.env.NEXT_PUBLIC_CLAIM_ETH_PRICE!),
  },
];

export default async function (req: ITokenApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(400).send(`Method ${req.method} not accepted`);
    res.end();
    return;
  }
  const { clubId } = req.body;
  console.log('ClubId: ', clubId);

  if (!clubId) {
    res.status(400).send(`clubId is not provided`);
    res.end();
    return;
  }

  try {
    const clubInfo = await adminFirestore
      .collection("clubs")
      .doc(clubId)
      .get()
      .then((doc) => doc.data() as IClubInfo);

    // Step 1: Initiate a ethers wallet based on club wallet mnemonic
    const path = `${process.env.NEXT_PUBLIC_ETH_STANDARD_PATH}/${process.env.NEXT_PUBLIC_DEFAULT_ACTIVE_INDEX}`;
    const chainId = parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!);
    const provider = new ethers.providers.JsonRpcProvider(
      getChainData(chainId).rpc_url
    );
    const clubWallet = ethers.Wallet.fromMnemonic(
      clubInfo.club_wallet_mnemonic!,
      path
    ).connect(provider);
    console.log("Club wallet private key: ", clubWallet.privateKey);

    // Step 2: Initiate a ThirdWebSDK with the club wallet
    const sdk = new ThirdwebSDK(clubWallet);
    const address = await sdk.getSigner()!.getAddress();
    // console.log("SDK is initiated using address: ", address);

    // Step 3: Deploy a token drop contract for the club
    const clubTokenContractAddress = await sdk.deployer.deployTokenDrop({
      name: clubInfo.club_name,
      primary_sale_recipient: address,
      description: clubInfo.club_description,
      symbol: clubInfo.club_token_sym,
      image: clubInfo.club_image,
    })
    .then((response) => {
      console.log(
        "✅ Successfully deployed token module, address:",
        response
      );
      return response;
    });

    // Step 4: set initial claim condition for the club token
    const clubTokenContract = sdk.getContract(clubTokenContractAddress!);
    await (
      await clubTokenContract
    ).erc20.claimConditions.set(initialClaimCondition)
    .then((result) => console.log("Claim condition set: ", result));

    // Step 5: add the club token address to the club record for future use
    await adminFirestore.collection("clubs").doc(clubId).update({
      club_token_address: clubTokenContractAddress,
    })
    .then((result) => console.log(result));

    res.status(200);
    res.end();
  } catch (err) {
    res.status(501).send({ error: err });
    res.end();
  }

  // DEPRICATED: adding a record of the user to the roles collection to show the club
  // // Check if the user already created a club before
  // const rolesDocRef = adminFirestore.collection("roles").doc(userId);
  // const doc = await rolesDocRef.get();
  // if (!doc.exists) {
  //   // If no, then create a new record in the roles collection for the user
  //   await adminFirestore
  //     .collection("roles")
  //     .doc(userId)
  //     .set({
  //       clubs: [clubId],
  //     })
  //     .then((result) => {
  //       res
  //         .status(201)
  //         .send({
  //           status: "created new record in roles for user",
  //           clubId: clubId,
  //         });
  //     })
  //     .catch((err) => {
  //       res.status(501).send({ error: err });
  //     });
  // } else {
  //   // If yes, add this new club to the user's record in roles
  //   await rolesDocRef
  //     .update({
  //       clubs: firestore.FieldValue.arrayUnion(clubId),
  //     })
  //     .then((result) => {
  //       res
  //         .status(201)
  //         .send({ status: "updated user record in roles", clubId: clubId });
  //     })
  //     .catch((err) => res.status(501).send({ error: err }));
  // }
}
