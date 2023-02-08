import { cookies } from "next/headers";
import { Suspense } from "react";
import { adminAuth } from "../../../firebase/firebaseAdmin";
import { verifyClubHolding } from "../../../lib/ethereum";
import { redis } from "../../../lib/redis";
import ClubDetails from "./(ClubDetails)/ClubDetails";
import ClubMembers from "./(ClubMembers)/ClubMembers";
import LoadingClubMembers from "./(ClubMembers)/LoadingClubMembers";
import PortfolioWrapper from "./(Portfolio)/PortfolioWrapper";
import WidgetSectionWrapper from "./(Widget)/WidgetSectionWrapper";
import LoadingWidgetSectionWrapper from "./(Widget)/LoadingWidgetSectionWrapper";
import InviteModalWrapper from "./(InviteModal)/InviteModalWrapper";
import InviteButton from "./(InviteModal)/InviteButton";
import clsx from "clsx";

// Get the cookies and determine auth state
async function getAuth() {
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
  const verify = await verifyAccess(params.id, authToken!);
  // console.log(verify, typeof verify)
  return (
    <>
      <div className="md:max-w-[1000px] w-full md:mx-auto h-full md:flex md:flex-row md:items-start flex flex-col gap-8 md:gap-10">
        {/* Left panel */}
        <div className="flex flex-col items-start gap-8 md:grow md:h-full">
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
                <InviteButton />
              </div>
            )}
          </div>
          {verify && (
            // @ts-expect-error Server Component
            <PortfolioWrapper id={params.id} />
          )}
        </div>
        {/* Right panel */}
        <div className="flex flex-col gap-5 md:w-[420px]">
          <Suspense fallback={<LoadingWidgetSectionWrapper />}>
            {/* @ts-expect-error Server Component */}
            <WidgetSectionWrapper id={params.id} verify={verify} />
          </Suspense>
        </div>
      </div>
      <InviteModalWrapper />
    </>
  );
}
