import { cookies } from "next/headers";
import { Suspense } from "react";
import { Button } from "../../../components/Button/Button";
import { adminAuth } from "../../../firebase/firebaseAdmin";
import { verifyClubHolding } from "../../../lib/ethereum";
import { redis } from "../../../lib/redis";
import ClubDetails from "./(ClubDetails)/ClubDetails";
import ClubMembers from "./(ClubMembers)/ClubMembers";
import LoadingClubMembers from "./(ClubMembers)/LoadingClubMembers";
import PortfolioWrapper from "./(Portfolio)/PortfolioWrapper";
import LoadingWidget from "../../../components/Widgets/LoadingWidget";
import WidgetSectionWrapper from "./(Widget)/WidgetSectionWrapper";

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
        <div className="md:max-w-[1000px] w-full md:mx-auto h-full md:flex md:flex-row md:items-start md:gap-6 flex flex-col gap-8">
          {/* Left panel */}
          <div className="flex flex-col items-start gap-8 w-full">
            {/* Club details and members */}
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
            </div>
            {verify && (
              // @ts-expect-error Server Component
              <PortfolioWrapper id={params.id} />
            )}
          </div>
          {/* Right panel */}
          <div className="flex flex-col gap-5">
              <Suspense>
                {/* @ts-expect-error Server Component */}
                <WidgetSectionWrapper id={params.id} verify/>
              </Suspense>
          </div>
        </div>
      ) : (
        <>Not authed</>
      )}
    </>
  );
}
