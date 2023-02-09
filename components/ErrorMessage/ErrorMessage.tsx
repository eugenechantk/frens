import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../Button/Button";
import Alarm3d from '../../public/Alarm_3d.png'
import { CodeBlock } from "react-code-blocks";

export default function ErrorMessage(err: string) {
  const router = useRouter();
  return (
    <div className="h-full max-w-[480px] py-8 md:py-12 px-4 md:px-6 flex flex-col items-center justify-center gap-4 mx-auto">
      <Image src={Alarm3d} alt="error occured" height={86} />
      <div className="flex flex-col gap-2">
        <h3 className="text-center">Something went wrong</h3>
        <p className="text-center">
        Don’t worry. Just refresh the page and see if it helps, or go back to the previous page.
        </p>
      </div>
      <CodeBlock
        text={err}
        wrapLines
      />
      <Button className="w-[180px]" variant="secondary" onClick={() => router.back()}>
        <h5>Go back</h5>
      </Button>
    </div>
  );
}
