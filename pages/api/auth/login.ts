import { FirebaseError } from "@firebase/util";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { signInWithCustomToken } from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../../firebase/firebaseAdmin";
import { firebaseClientAuth } from "../../../firebase/firebaseClient";
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

  // STEP 1: CHECK IF THE INCOMING USER IS LEGIT BY ITS SIGNATURE
  // verify if the message is really signed by the user
  const verified = verifyAddress(sig, address);

  if (verified) {
    // STEP 2: CREATE CUSTOM TOKEN USING USER'S ADDRESS AS UID
    const customToken = await firebaseAdmin.auth().createCustomToken(address);
    let userFetch: UserRecord;

    // STEP 2: CREATE NEW USER IN FIREBASE AUTH
    // Check if there is an existing user in firebase auth
    try {
      userFetch = await firebaseAdmin.auth().getUser(address);
      // DEBUG START
      console.log("EXISTING USER: ", userFetch);
      console.log("TOKEN: ", customToken);
      // DEBUG END
    } catch (err: FirebaseError | any) {
      // if there is no existing user in firebase auth, create a new user
      if (err.code === "auth/user-not-found") {
        await firebaseAdmin.auth().createUser({
          uid: address,
        });
        // DEBUG START
        userFetch = await firebaseAdmin.auth().getUser(address);
        console.log("NEW USER: ", userFetch);
        console.log("TOKEN: ", customToken);
        // DEBUG END
      } else {
        res.status(500).send(err);
        res.end();
        return;
      }
    }
    // STEP 3: RETURN THE CUSTOM TOKEN
    res.status(202).json({
      token: customToken,
    });
    res.end();
    return;
    
  } else {
    res.status(401).send("Error: sign in signature not verified");
    res.end();
    return;
  }
}
