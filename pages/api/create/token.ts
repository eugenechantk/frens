import { firestore } from "firebase-admin";
import { arrayUnion, FieldValue } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { adminFirestore } from "../../../firebase/firebaseAdmin";

interface ITokenApiRequest extends NextApiRequest {
  body: {
    clubId: string;
    userId: string;
  };
}

export default async function (req: ITokenApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(400).send(`Method ${req.method} not accepted`);
    res.end();
    return;
  }
  const { clubId, userId } = req.body;
  // console.log(clubId, userId);

  if (!clubId || !userId) {
    res.status(400).send(`clubId or userId is not provided`);
    res.end();
    return;
  }

  // Check if the user already created a club before
  const rolesDocRef = adminFirestore.collection("roles").doc(userId);
  const doc = await rolesDocRef.get();
  if (!doc.exists) {
    // If no, then create a new record in the roles collection for the user
    await adminFirestore
      .collection("roles")
      .doc(userId)
      .set({
        clubs: [clubId],
      })
      .then((result) => {
        res
          .status(201)
          .send({
            status: "created new record in roles for user",
            clubId: clubId,
          });
      })
      .catch((err) => {
        res.status(501).send({ error: err });
      });
  } else {
    // If yes, add this new club to the user's record in roles
    await rolesDocRef
      .update({
        clubs: firestore.FieldValue.arrayUnion(clubId),
      })
      .then((result) => {
        res
          .status(201)
          .send({ status: "updated user record in roles", clubId: clubId });
      })
      .catch((err) => res.status(501).send({ error: err }));
  }
  res.end();
}
