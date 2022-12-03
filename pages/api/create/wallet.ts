import { NextApiRequest, NextApiResponse } from "next";
import { initWallet } from "../../../lib/ethereum";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const mnemonic =
        "camp viable army easy document betray lens empower report leaf twenty achieve";
      const wallet = initWallet(mnemonic);
      res.status(200);
      res.send({wallet: wallet})
      res.end();
    } catch (err) {
      res.status(501).send({ error: err });
      res.end();
    }
  } else {
    res
      .status(400)
      .send({ error: `Method ${req.method} not accepted in this route` });
    res.end();
  }
}
