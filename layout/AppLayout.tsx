import React from "react";
import NavBar from "../components/NavBar/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full flex flex-col">
      <NavBar />
      <main className="grow">
        <div className="md:max-w-[1000px] w-full md:mx-auto px-4 pt-3 md:pt-12 pb-5 h-full md:flex md:flex-row md:items-start md:gap-6 flex flex-col gap-8">
          {children}
        </div>
      </main>
    </div>
  );
}
