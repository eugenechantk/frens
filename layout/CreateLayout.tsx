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
      md:items-center md:justify-center md:py-12"
    >
      {/* For the container of all the create club conent */}
      <div
        className="
        grow
        md:flex md:flex-col md:p-6 md:items-start md:gap-6
        md:border md:border-secondary-300 md:rounded-20 md:w-[620px]
        flex flex-col items-start pt-3 pb-6 px-4 gap-6"
      >
        {/* section header */}
        <div className="
          flex
          md:flex-row md:items-center md:gap-4 md:w-full
          flex-col items-start gap-4"
        >
          <h3 className=" leading-8 font-bold md:order-1 order-2 grow">Create your club</h3>
          <Button variant="secondary-outline" className="md:order-2 order-1" onClick={() => router.push('/dashboard')}>
            <XMarkIcon className="w-5"/>
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}