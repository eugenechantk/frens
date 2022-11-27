import { FirebaseError } from "@firebase/util";
import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../../firebase/firebaseAdmin";
import { clientStorage } from "../../../firebase/firebaseClient";
import { verifyAddress } from "../../../lib/ethereum";
import generate from "project-name-generator";
import _ from "lodash";
import { getDownloadURL, ref } from "firebase/storage";

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
    let newUser = true;

    // STEP 2: CREATE NEW USER IN FIREBASE AUTH
    // Check if there is an existing user in firebase auth
    try {
      await firebaseAdmin
        .auth()
        .getUser(address)
        .then(() => (newUser = false));
    } catch (err: FirebaseError | any) {
      // if there is no existing user in firebase auth, create a new user in firebase auth
      if (err.code === "auth/user-not-found") {
        const _userCreated = await firebaseAdmin.auth().createUser({
          uid: address,
        });
        const _displayName = _.upperFirst(generate().spaced);
        const _profileImg = _.random(1, 8);
        const _profilePicStorageRef = ref(
          clientStorage,
          `default_avatars/${_profileImg}.png`
        );
        const _profilePicUrl = await getDownloadURL(_profilePicStorageRef);
        await firebaseAdmin
          .auth()
          .updateUser(address, {
            displayName: _displayName,
            photoURL: _profilePicUrl,
          })
          // FOR DEBUGGING
          .then((userRecord) =>
            console.log("Successfully updated user: ", userRecord.toJSON())
          );
      } else {
        res.status(500).send(err);
        res.end();
        return;
      }
    }
    // STEP 3: RETURN THE CUSTOM TOKEN
    res.status(202).json({
      token: customToken,
      new_user: newUser,
    });
    res.end();
    return;
  } else {
    res.status(401).send("Error: sign in signature not verified");
    res.end();
    return;
  }
}
