import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import formidable from "formidable";
import { adminFirestore, adminStorage } from "../../../firebase/firebaseAdmin";
import { getDownloadURL, ref } from "firebase/storage";
import {
  clientFireStore,
  clientStorage,
  firebaseClient,
} from "../../../firebase/firebaseClient";
import { arrayUnion, doc, FieldValue, updateDoc } from "firebase/firestore";
import bodyParser, { json } from "body-parser";
import PersistentFile from "formidable/PersistentFile";

interface MulterRequest extends NextApiRequest {
  body: any;
  file: any;
}

const serviceAccount = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_ADMIN_SECRET as string
);

let uid: string;

// const router = createRouter<MulterRequest, NextApiResponse>();

// router
//   // .use(expressWrapper(json({limit: '50mb'})))
//   .use((req, res, next) => {
//     const form = formidable({ multiples: true });
//     form.parse(req, (err, fields, files) => {
//       req.body = { ...fields };
//       req.file = { ...files };
//       return next();
//     });
//   })
// // First step: Create club record with name, description, symbol and deposited?
// .post(async (req: MulterRequest, res: NextApiResponse, next) => {
//   let profileImgPath;
//   console.log(req.body, req.file);
//   try {
//     const { id } = await adminFirestore.collection("clubs").add({
//       club_name: req.body.club_name,
//       club_description: req.body.club_description,
//       club_token_sym: req.body.club_token_sym,
//       club_members: [],
//       deposited: false,
//     });
//     uid = id;
//     console.log(`Club created in firestore: ${id}`);

//     // Second step: upload the club profile photo if there is any file
//     if (req.file.club_image) {
//       console.log("trying to upload profile");
//       console.log(req.file.club_image.filepath);
//       const options = {
//         destination: `club_profile/${req.file.club_image.newFilename}`,
//         contentType: req.file.club_image.mimetype,
//       };
//       const uploadResult = await adminStorage.upload(
//         req.file.club_image.filepath,
//         options
//       );
//       console.log(uploadResult);
//       // profileImgPath = uploadResult[0].metadata.name;
//       profileImgPath = await getDownloadURL(
//         ref(clientStorage, uploadResult[0].metadata.name)
//       );
//     } else {
//       profileImgPath = await getDownloadURL(
//         ref(clientStorage, "club_profile/default_club.png")
//       );
//     }

//     // Third step: update profile image field of the club
//     const updateProfileImgResult = await adminFirestore
//       .collection("clubs")
//       .doc(uid)
//       .update({
//         club_image: profileImgPath,
//       });

//     // [For demo] add the user to the club_members collection
//     console.log(typeof req.body.user_id);
//     const updateMemberResult = await updateDoc(
//       doc(clientFireStore, "clubs", uid),
//       {
//         club_members: arrayUnion(req.body.user_id),
//       }
//     );

//     res.status(200).send({
//       club_id: uid,
//     });
//     res.end();
//   } catch (error) {
//     res.status(501).send({ error: `error: ${error}` });
//     res.end();
//   }
// });

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, file) => {
    console.log(fields, file);
    let profileImgPath;
    try {
      const { id } = await adminFirestore.collection("clubs").add({
        club_name: fields.club_name,
        club_description: fields.club_description,
        club_token_sym: fields.club_token_sym,
        deposited: false,
      });
      uid = id;
      console.log(`Club created in firestore: ${id}`);

      // Second step: upload the club profile photo if there is any file
      if (file.club_image) {
        console.log("trying to upload profile");
        // @ts-ignore
        console.log(file.club_image.filepath);
        const options = {
          // @ts-ignore
          destination: `club_profile/${file.club_image.newFilename}`,
          // @ts-ignore
          contentType: file.club_image.mimetype,
        };
        const uploadResult = await adminStorage.upload(
          // @ts-ignore
          file.club_image.filepath,
          options
        );
        console.log(uploadResult);
        // profileImgPath = uploadResult[0].metadata.name;
        profileImgPath = await getDownloadURL(
          ref(clientStorage, uploadResult[0].metadata.name)
        );
      } else {
        profileImgPath = await getDownloadURL(
          ref(clientStorage, "club_profile/default_club.png")
        );
      }

      // Third step: update profile image field of the club
      const updateProfileImgResult = await adminFirestore
        .collection("clubs")
        .doc(uid)
        .update({
          club_image: profileImgPath,
        });

      // // [For demo] add the user to the club_members collection
      // console.log(typeof req.body.user_id);
      // const updateMemberResult = await updateDoc(
      //   doc(clientFireStore, "clubs", uid),
      //   {
      //     club_members: arrayUnion(req.body.user_id),
      //   }
      // );

      res.status(200).send({
        club_id: uid,
      });
      res.end();
    } catch (error) {
      res.status(501).send({ error: `error: ${error}` });
      res.end();
    }
  })
}
// export default router.handler({
//   onError: (err: any, req, res) => {
//     console.error(err.stack);
//     res.status(500).end(`error: ${err}`);
//   },
//   onNoMatch: (req, res) => {
//     res.status(404).end(`Method ${req.method} not accepted`);
//   },
// });

export const config = {
  api: {
    bodyParser: false
  },
};
