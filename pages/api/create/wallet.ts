import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { adminFirestore } from "../../../firebase/firebaseAdmin";
import { IClubInfo } from "../../../lib/fetchers";
import { withAuth } from "../middleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(404).end(`Method ${req.method} not accepted`);
    res.end();
  }
  try {
    // Step 0: check if the club already has a wallet initiated
    const clubInfo = await adminFirestore
      .collection("clubs")
      .doc(req.body.clubId)
      .get()
      .then((doc) => doc.data() as IClubInfo);
    console.log(clubInfo);
    if (clubInfo.club_wallet_address && clubInfo.club_wallet_mnemonic) {
      res.status(201);
      res.send({
        address: clubInfo.club_wallet_address,
        mnemonic: clubInfo.club_wallet_mnemonic,
        firestoreResult: clubInfo,
      });
      res.end();
      return;
    }
    // Step 1: Create ethers wallet
    const genEntropy = ethers.utils.hexlify(ethers.utils.randomBytes(16));
    const genMnemonic = ethers.utils.entropyToMnemonic(genEntropy);
    const path = `${process.env.NEXT_PUBLIC_ETH_STANDARD_PATH}/${process.env.NEXT_PUBLIC_DEFAULT_ACTIVE_INDEX}`;
    const wallet = ethers.Wallet.fromMnemonic(genMnemonic, path);

    // Step 2: get the mnemonic and store in db
    const result = await adminFirestore
      .collection("clubs")
      .doc(req.body.clubId)
      .update({
        club_wallet_mnemonic: wallet.mnemonic.phrase,
        club_wallet_address: wallet.address,
      });
    // Step 3: return the address of the wallet
    res.status(201);
    res.send({
      address: wallet.address,
      mnemonic: wallet.mnemonic.phrase,
      firestoreResult: result,
    });
    res.end();
  } catch (err) {
    res.status(501).send({ error: err });
    res.end();
  }
};

export default withAuth(handler);
