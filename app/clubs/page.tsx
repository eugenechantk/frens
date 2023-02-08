import { Button } from "../../components/Button/Button";
import Link from "next/link";
import { cookies } from "next/headers";
import { adminAuth } from "../../firebase/firebaseAdmin";
import { getUserHoldings } from "../../lib/ethereum";
import { redis } from "../../lib/redis";
import ClubCard from "./(ClubCard)/ClubCard";
import { Suspense } from "react";
import LoadingClubCard from "./(ClubCard)/LoadingClubCard";
import NotAuthed from "../../components/NotAuthed/NotAuthed";

// Get the cookies and determine auth state
async function getUserAddress() {
  let userAddress = undefined;
  const token = cookies().get("token")?.value;
  if (token) {
    const decodedToken = await adminAuth.verifyIdToken(token);
    userAddress = decodedToken.uid;
  }
  return userAddress;
}

// Fetch all the club ids that match with user's holding
async function getAllClubIds(userAddress: string) {
  const erc20Tokens = await getUserHoldings(userAddress);
  const results = await Promise.all(
    erc20Tokens.map(async (token) => {
      // console.log(token)
      const id: string | null = await redis.get(token);
      return id;
    })
  );
  // console.log(results)
  const clubIds = results.filter((result) => result !== null);
  return clubIds as string[];
}

export default async function Page() {
  const userAddress = await getUserAddress();
  let clubIds: string[] = [];
  if (userAddress) {
    clubIds = await getAllClubIds(userAddress);
  }

  return (
    <>
      {!userAddress ? (
        <NotAuthed />
      ) : (
        <div className="flex flex-col gap-6 md:gap-8 max-w-[1000px] mx-auto">
          {/* Title and create button for desktop */}
          <div className="flex flex-row items-start justify-between w-full">
            <h1>My clubs</h1>
            <Link href="/create">
              <Button className="w-[218px] hidden md:block">
                <h3>Create new club</h3>
              </Button>
            </Link>
          </div>
          {/* Club cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full justify-items-center">
            {clubIds.map((id, index) => {
              return (
                // @ts-expect-error Server Component
                <ClubCard id={id} key={index} />
              );
            })}
            <Link href="/create">
              <Button className="w-[218px] md:hidden">
                <h3>Create new club</h3>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
