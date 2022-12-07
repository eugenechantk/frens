import React, { ReactElement } from "react";
import AppLayout from "../../layout/AppLayout";
import { useRouter } from "next/router";
import { useAuth } from "../../lib/auth";
import { NextPageWithLayout } from "../_app";
import { Button } from "../../components/Button/Button";
import ClubCard from "../../components/ClubCard/ClubCard";
import defaultImg from "../../public/default_club.png";

const ClubList: NextPageWithLayout<any> = () => {
  const user = useAuth();
  const router = useRouter();
  // console.log(user && user.user)
  return (
    <div className="h-full w-full py-8 md:py-12 px-4 md:px-6">
      <div className="flex flex-col items-center gap-6 md:gap-8 max-w-[1000px] mx-auto">
        {/* Title and create button for desktop */}
        <div className="flex flex-row items-start justify-between w-full">
          <h1>My clubs</h1>
          <Button className="w-[218px] hidden md:block">
            <h3>Create new club</h3>
          </Button>
        </div>
        {/* Club cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ClubCard
            clubName="Testing"
            clubDes="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris eleifend condimentum vel consectetur semper justo, dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris eleifendcondimentum vel consectetur semper justo, dictum. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Mauris mauris eleifend condimentum vel consectetursemper justo, dictum. justo, dictum condimentum vel consectetursemper."
            profileImgUrl={defaultImg}
          />
        </div>
        <Button className="w-[218px] block md:hidden mb-6">
            <h3>Create new club</h3>
        </Button>
      </div>
    </div>
  );
};

ClubList.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default ClubList;
