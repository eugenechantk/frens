import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { Button } from "../../../components/Button/Button";
import { adminAuth } from "../../../firebase/firebaseAdmin";
import { verifyClubHolding } from "../../../lib/ethereum";
import { redis } from "../../../lib/redis";
import ClubDetails from "./(ClubDetails)/ClubDetails";
import ClubMembers from "./(ClubMembers)/ClubMembers";
import LoadingClubMembers from "./(ClubMembers)/LoadingClubMembers";
import Portfolio from "./(Portfolio)/Portfolio";

// Get the cookies and determine auth state
async function getAuth() {
  let authed = false;
  const nextCookies = cookies();
  return nextCookies.get("token")?.value;
}

async function verifyAccess(clubId: string, authToken: string) {
  const [decodedToken, tokenAddress] = await Promise.all([
    await adminAuth.verifyIdToken(authToken),
    await redis.hget<string>(clubId, "token_address"),
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
        <>
          <div className="flex flex-col items-start gap-4 w-full">
            {/* @ts-expect-error Server Component */}
            <ClubDetails id={params.id} />
            {verify && (
              <div className="flex flex-row gap-2 items-center">
                <Suspense fallback={<LoadingClubMembers />}>
                  {/* @ts-expect-error Server Component */}
                  <ClubMembers id={params.id} />
                </Suspense>
                <Button variant="outline" size="sm">
                  <h4>Invite</h4>
                </Button>
              </div>
            )}
            {verify && (
              <div className="w-full flex flex-col items-start gap-3">
                {/* Title */}
                <div className="flex flex-row justify-between items-center w-full">
                  <h2>Portfolio</h2>
                  <Button variant="text-only" size="sm">
                    <p className="!text-gray-500 !font-sans">View activity</p>
                    <ArrowTopRightOnSquareIcon className="w-5 !text-gray-500" />
                  </Button>
                </div>
                <Suspense>
                  {/* @ts-expect-error Server Component */}
                  <Portfolio id={params.id} />
                </Suspense>
              </div>
            )}
          </div>
        </>
      ) : (
        <>Not authed</>
      )}
    </>
  );
}
