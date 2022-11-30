import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../components/Button/Button";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    // For center aligning the create container in wide-screen
    <div
      className="
      w-full h-full flex flex-col
      md:items-center md:justify-center"
    >
      {/* For the container of all the create club conent */}
      <div
        className="
        h-full
        md:flex md:flex-col md:items-start md:gap-6
        md:border md:border-secondary-300 md:rounded-20 md:w-[620px]
        md:overflow-auto md:my-12
        flex flex-col items-start gap-6"
      >
        {/* section header */}
        <div className="
          flex
          md:flex-row md:items-center md:gap-4 md:w-full
          flex-col items-start gap-4
          md:pb-4 md:sticky md:top-0 md:bg-secondary-100 md:p-6
          p-4 z-20"
        >
          <h3 className=" leading-8 font-bold md:order-1 order-2 grow ">Create your club</h3>
          <Button variant="secondary-outline" className="md:order-2 order-1" onClick={() => router.push('/dashboard')}>
            <XMarkIcon className="w-5"/>
          </Button>
        </div>
        <div className="md:px-6 md:pb-6 px-4 pb-6">
          {children}
        </div>
        
      </div>
    </div>
  );
}
