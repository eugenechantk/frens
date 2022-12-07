import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import formidable from "formidable";
import { adminFirestore, adminStorage } from "../../../firebase/firebaseAdmin";

interface MulterRequest extends NextApiRequest {
  body: any;
  file: any;
}

const serviceAccount = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_ADMIN_SECRET as string
);

let uid:string;

// // Set up the Multer instance to connec to firebase storage
// const upload = multer({
//   storage: MulterFirebaseStorage({
//     bucketName: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     credentials: {
//       privateKey: serviceAccount.private_key,
//       clientEmail: serviceAccount.client_email,
//       projectId: serviceAccount.project_id,
//     },
//     directoryPath: `club_profile`,
//   }),
// });

const router = createRouter<MulterRequest, NextApiResponse>();

router
  .use((req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      req.body = { ...fields };
      req.file = { ...files };
      return next();
    });
  })
  // First step: Create club record with name, description, symbol and deposited?
  .post(async (req: MulterRequest, res: NextApiResponse, next) => {
    let profileImgPath = 'club_profile/default_profile.png';
    console.log(req.body, req.file);
    try {
      const { id } = await adminFirestore
        .collection("clubs")
        .add({
          ...req.body,
          deposited: false,
        });
      uid = id;
      console.log(`Club created in firestore: ${id}`);
    } catch (error) {
      res.status(501).send({ error: `error: ${error}` });
      res.end();
    }
    // Second step: upload the club profile photo if there is any file
    if (req.file.club_image) {
      try {
        console.log('trying to upload profile')
        console.log(req.file.club_image.filepath)
        const options = {
          destination: `club_profile/${req.file.club_image.newFilename}`,
          contentType: req.file.club_image.mimetype
        }
        const uploadResult = await adminStorage.upload(req.file.club_image.filepath, options);
        console.log(uploadResult);
        profileImgPath = uploadResult[0].metadata.name;
      } catch (error) {
        res.status(501).send({ error: `error: ${error}` });
        res.end();
      }
    }
    // Third step: update profile image field of the club
    try {
      const result = await adminFirestore.collection("clubs").doc(uid).update({
        club_image: profileImgPath
      })
      res.status(200).send({
        club_id: uid,
      })
      res.end()
    } catch (error) {
      res.status(501).send({ error: `error: ${error}` });
      res.end();
    }
  });

// Create a nextConnect router, with error checks as first middlewares

// apiRoute.use(bodyParser.urlencoded({ extended: true }));

// // Second middleware: upload the image specified in the 'club_image' key of FormData
// // apiRoute.use(upload.single("club_image"));

// apiRoute.post(upload.single("club_image"), (req: MulterRequest, res: NextApiResponse) => {
//   // get firebase storage path of the uploaded club image
//   const profileImgPath = req.file.path;
//   res.status(200).json({ data: "success" });
// });

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(500).end(`error: ${err}`);
  },
  onNoMatch: (req, res) => {
    res.status(404).end(`Method ${req.method} not accepted`);
  },
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
