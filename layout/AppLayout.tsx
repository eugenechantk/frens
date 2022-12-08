import { useRouter } from "next/router";
import React, { useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import { useAuth } from "../lib/auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useAuth();
  const router = useRouter();
  useEffect(() => {
    router.replace({ pathname: router.pathname, query: router.query });
  }, [user.user]);
  return (
    <div className="h-full w-full flex flex-col">
      <NavBar />
      <main className="grow overflow-scroll">
        {user.user ? (
          children
        ) : (
          <div className="h-full w-full py-8 md:py-12 px-4 md:px-6">
            <h3>Please login before continuing</h3>
          </div>
        )}
        {/* {children} */}
      </main>
    </div>
  );
}
