import { cookies } from "next/headers";
import { adminAuth } from "../../../firebase/firebaseAdmin";
import { verifyClubHolding } from "../../../lib/ethereum";
import { fetchClubInfo, IClubInfo } from "../../../lib/fetchers";
import { redis } from "../../../lib/redis";

// Get the cookies and determine auth state
async function getAuth() {
  let authed = false;
  const nextCookies = cookies();
  return nextCookies.get("token")?.value;
}

async function verifyAccess(clubId: string, authToken: string) {
  const [decodedToken, tokenAddress] = await Promise.all([
    await adminAuth.verifyIdToken(authToken),
    await redis.get<string>(clubId),
  ]);
  const verify = await verifyClubHolding(decodedToken.uid, tokenAddress!);
  return verify;
}

export default async function Page({ params }: { params: { id: string } }) {
  const authToken = await getAuth();
  let verify = false;
  if (authToken) {
    verify = await verifyAccess(params.id, authToken);
  }
  return (
    <>
      {authToken ? (
        verify ? (
          <>Club Dashboard</>
        ) : (
          <>This user is not verified</>
        )
      ) : (
        <>Not authed</>
      )}
    </>
  );
}
