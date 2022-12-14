import React, { lazy, ReactElement, Suspense } from "react";
import AppLayout from "../../../layout/AppLayout";
import { NextPageWithLayout } from "../../_app";
import { useAuth } from "../../../lib/auth";
import { useRouter } from "next/router";
import { firebaseAdmin } from "../../../firebase/firebaseAdmin";
import { InferGetServerSidePropsType } from "next";
import ClubDetails from "../../../components/ClubDetails/ClubDetails";
import ClubMembers from "../../../components/ClubMembers/ClubMembers";
import ClubBalance from "../../../components/ClubBalance/ClubBalance";
import Portfolio from "../../../components/Portfolio/Portfolio";
import WidgetSection from "../../../components/Widgets/WidgetSection";
const TradeAsset = lazy(() => import("../../../components/Widgets/TradeAsset"));

type ClubInfo = {
  club_description: string;
  club_image: string;
  club_name: string;
  club_token_sym: string;
  club_wallet_address: string;
  club_wallet_mnemonic: string;
  deposited: boolean;
  club_members: string[];
};

const fetchClubInfo = async (id: string) => {
  try {
    const _clubInfo = await firebaseAdmin
    .firestore()
    .collection("clubs")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        throw new Error('club does not exist in database')
      }
      return doc.data() as ClubInfo;
    })
    .then((data) => {
      const { club_name, club_description, club_image, club_members, club_wallet_address } = data!;
      return {
        club_name,
        club_description,
        club_image,
        club_members,
        club_wallet_address,
      };
    })
    return _clubInfo
  } catch (err) {
    throw err
  }
};

const fetchPortfolio = async (address: string) => {
  
}

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  console.log(id);
  try {
    const clubInfo = await fetchClubInfo(id);
    console.log(clubInfo)
  } catch (err) {
    console.log(err)
  }
  
  
  return {
    props: {
    },
  };
};

const Dashboard: NextPageWithLayout<any> = ({
  ...serverProps
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(serverProps);
  const user = useAuth();
  const router = useRouter();
  // console.log(user && user.user)
  return (
    <div className="md:max-w-[1000px] w-full md:mx-auto px-4 pt-3 md:pt-12 pb-5 h-full md:flex md:flex-row md:items-start md:gap-6 flex flex-col gap-8">
      {/* Left panel */}
      <div className="flex flex-col items-start gap-8 w-full">
        {/* Club details and members */}
        <div className="flex flex-col items-start gap-4 w-full">
          <ClubDetails />
          <ClubMembers />
        </div>
        {/* Balance */}
        {/* TODO: have a global state setting for whether to show club or me balance */}
        <ClubBalance />
        {/* Portfolio */}
        <Portfolio />
      </div>
      {/* Right panel */}
      <WidgetSection />
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Dashboard;
