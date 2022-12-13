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

// export const getServerSideProps = async (context: any) => {
//   const { id } = context.params;
//   const clubInfo = await firebaseAdmin
//     .firestore()
//     .collection("clubs")
//     .doc(id)
//     .get()
//     .then((doc) => {
//       if(!doc.exists) {
//         return {
//           notFound: true,
//         };
//       }
//       return doc.data()
//     }).then((data) => {
//       return {
//         props: {
//           ...data
//         }
//       }
//     }).catch((err) => {
//       console.log(err);
//       return {
//         notFound: true,
//       };
//     });
//   return {
//     ...clubInfo
//   };
// };

const Dashboard: NextPageWithLayout<any> = () => {
  // console.log(serverProps)
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
      <WidgetSection/>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Dashboard;
