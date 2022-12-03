import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { adminFirestore } from "../../../firebase/firebaseAdmin";
import { createRouter } from "next-connect";
import bodyParser from "body-parser";

interface IWalletApiRequest extends NextApiRequest {
  body: {
    clubId: string;
  }
}

const router = createRouter<IWalletApiRequest, NextApiResponse>();

router
  .use(bodyParser.json())
  .post(async (req: IWalletApiRequest, res: NextApiResponse) => {
    try {
      // Step 1: Create ethers wallet
      const genEntropy = ethers.utils.hexlify(ethers.utils.randomBytes(16));
      const genMnemonic = ethers.utils.entropyToMnemonic(genEntropy);
      const path = `${process.env.NEXT_PUBLIC_ETH_STANDARD_PATH}/${process.env.NEXT_PUBLIC_DEFAULT_ACTIVE_INDEX}`;
      const wallet = ethers.Wallet.fromMnemonic(genMnemonic, path);
      console.log(wallet);

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
  });

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(500).end(`error: ${err}`);
  },
  onNoMatch: (req, res) => {
    res.status(404).end(`Method ${req.method} not accepted`);
  },
});

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//   } else {
//     res
//       .status(400)
//       .send({ error: `Method ${req.method} not accepted in this route` });
//     res.end();
//   }
// }
