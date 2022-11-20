import { NextApiRequest, NextApiResponse } from "next";
import { verifyAddress } from "../../../utils/ethereum";

interface ILoginApiRequest extends NextApiRequest {
  body: {
    address: string;
    sig: string;
  }
}

export default async function(req: ILoginApiRequest, res: NextApiResponse) {
  // Req: wallet address, message signature
  // Res: firebase auth token

  if (!req.body) {
    res.statusCode = 404
    res.end('Request failed. Empty request body')
    return
  }

  const {address, sig} = req.body

  // verify if the message is really signed by the user
  const verified = verifyAddress(sig, address);

  if (verified) {
    res.status(202).json({status: 'ok'})
    res.end()
    return
  } else {
    res.status(401).json({status: 'not ok'})
    res.end()
    return
  }
}