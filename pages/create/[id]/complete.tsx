import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AppLayout from "../../../layout/AppLayout";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import { Button } from "../../../components/Button/Button";

const StepComplete: NextPageWithLayout<any> = () => {
  return (
    // Container to center the content
    <div className="flex flex-row items-center justify-center h-full w-full px-6">
      <div className="flex flex-col items-center justify-center gap-4 max-w-[480px]">
        <div className=" w-16 md:w-24 pointer-events-none">
          <ImageUpload />
        </div>
        {/* TODO: render name of the club created */}
        <h3 className="text-center">Welcome to Friends with Profits</h3>
        <p className="text-center">
          In your club, you can raise money from your friends and invest
          together in cryptocurrencies
        </p>
        <Button className="w-[245px]">Go to club</Button>
      </div>
    </div>
  );
};

StepComplete.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default StepComplete;
