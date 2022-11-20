import { FirebaseError } from "@firebase/util";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../../firebase/firebaseAdmin";
import { verifyAddress } from "../../../lib/ethereum";

interface ILoginApiRequest extends NextApiRequest {
  body: {
    address: string;
    sig: string;
  };
}

export default async function (req: ILoginApiRequest, res: NextApiResponse) {
  // Req: wallet address, message signature
  // Res: firebase auth token

  if (!req.body) {
    res.statusCode = 404;
    res.end("Request failed. Empty request body");
    return;
  }

  const { address, sig } = req.body;

  // verify if the message is really signed by the user
  const verified = verifyAddress(sig, address);

  if (verified) {
    const customToken = await firebaseAdmin.auth().createCustomToken(address);
    let user: UserRecord;
    try {
      user = await firebaseAdmin.auth().getUser(address);
      console.log("EXISTING USER: ", user);
      console.log("TOKEN: ", customToken);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        await firebaseAdmin.auth().createUser({
          uid: address,
        });
        user = await firebaseAdmin.auth().getUser(address);
        console.log("NEW USER: ", user);
        console.log("TOKEN: ", customToken);
      } else {
        res.status(500).json({ message: JSON.stringify(err) });
        res.end();
        return;
      }
    }
    res.status(202).json({ status: "ok" });
    res.end();
    return;
  } else {
    res.status(401).json({ status: "not ok" });
    res.end();
    return;
  }
}
