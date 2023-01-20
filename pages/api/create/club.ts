import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { adminFirestore, adminStorage, firebaseAdmin } from "../../../firebase/firebaseAdmin";
import { getDownloadURL, ref } from "firebase/storage";
import {
  clientStorage,
} from "../../../firebase/firebaseClient";
import { withAuth } from "../middleware";

let uid: string;

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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

export const config = {
  api: {
    bodyParser: false
  },
};

export default withAuth(handler)
