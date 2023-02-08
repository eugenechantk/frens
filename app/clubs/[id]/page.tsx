import { cookies } from "next/headers";
import { adminAuth } from "../../../firebase/firebaseAdmin";
import { verifyClubHolding } from "../../../lib/ethereum";
import { fetchClubInfo, IClubInfo } from "../../../lib/fetchers";

// Get the cookies and determine auth state
async function getAuth() {
  let authed = false;
  const nextCookies = cookies();
  return nextCookies.get("token")?.value;
}

async function getClubInfo(id: string) {
  const clubInfo: IClubInfo = await fetchClubInfo(id);
  return clubInfo
}

async function verifyAccess(authToken: string, tokenAddress: string) {
  const userAddress = await adminAuth
    .verifyIdToken(authToken)
    .then((decodedToken) => decodedToken.uid);
  const verify = await verifyClubHolding(
    userAddress,
    tokenAddress
  );
  return verify
}

export default async function Page({params}: {params: {id: string}}) {
  const authToken = await getAuth();
  let verify = false
  if (authToken) {
    verify = await getClubInfo(params.id).then(async (data: IClubInfo) => {
      const verify = await verifyAccess(authToken, data.club_token_address!)
      return verify
    });
  }
  return (
    <>
      {authToken ? (verify ? <>Club Dashboard</> : <>Not verified</>) : <>Not authed</>}
    </>
  );
}
