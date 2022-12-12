import React, { ReactElement } from "react";
import AppLayout from "../../../layout/AppLayout";
import { NextPageWithLayout } from "../../_app";
import { useAuth } from "../../../lib/auth";
import { useRouter } from "next/router";
import { firebaseAdmin } from "../../../firebase/firebaseAdmin";
import { InferGetServerSidePropsType } from "next";
import ClubDetails from "../../../components/ClubDetails/ClubDetails";
import ClubMembers from "../../../components/ClubMembers/ClubMembers";
import ClubBalance from "../../../components/ClubBalance/ClubBalance";


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
    <div className="md:max-w-[1000px] w-full md:mx-auto px-4 pt-3 md:pt-12 pb-5 h-full md:flex md:flex-row md:items-start md:gap-6">
      {/* Left panel */}
      <div className="flex flex-col items-start gap-8">
        {/* Club details and members */}
        <div className="flex flex-col items-start gap-4 w-full">
          <ClubDetails />
          <ClubMembers />
        </div>
        {/* Balance */}
        {/* TODO: have a global state setting for whether to show club or me balance */}
        <ClubBalance/>
        {/* Portfolio */}
      </div>
      {/* Right panel */}
      <p className="w-full md:w-[376px] h-[505px] bg-gray-200 shrink-0 rounded-20 p-6">
        Widget area
      </p>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Dashboard;
