import { InferGetServerSidePropsType } from "next";
import { ReactElement, useState } from "react";
import AppLayout from "../../../layout/AppLayout";
import { NextPageWithLayout } from "../../_app";
import nookies from "nookies";
import { fetchClubInfo, IClubInfo } from "../../../lib/fetchers";
import Image from "next/image";
import defaultClub from "../../../public/default_club.png";
import OwnershipItem from "../../../components/Split/OwnershipItem";
import { Button } from "../../../components/Button/Button";
import { useRouter } from "next/router";
import PayoutProgressLine from "../../../components/Payout/PayoutProgressLine";

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  const cookies = nookies.get(context);

  if (!cookies.token) {
    return {
      props: {
        error: "Not authed",
      },
    };
  } else {
    const clubInfo: IClubInfo = await fetchClubInfo(id);
    return {
      props: {},
    };
  }
};

const CloseClub: NextPageWithLayout<any> = ({
  ...serverProps
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;
  const [payoutProgress, setPayoutProgress] = useState<'not started' | 'in progress' | 'done'>('done');
  return (
    <div className="md:max-w-[1000px] w-full md:mx-auto px-4 pt-3 pb-5 h-full flex flex-col">
      <div className="flex flex-col gap-6 grow pb-4 md:flex-row md:items-center md:gap-10">
        {/* Description */}
        <div className="md:w-1/2">
          {/* Club title collapsed */}
          <div className="flex flex-row gap-3 mb-5">
            <div className="w-7 h-7 relative">
              <Image
                src={defaultClub}
                alt="Club profile image"
                fill
                className="rounded-[4px]"
                style={{ objectFit: "cover" }}
              />
            </div>
            <h4 className="grow">Satoshi Club</h4>
          </div>
          <h3 className="mb-3">Close club and distribute fund</h3>
          <p className="mb-2">
            We will have to close the club from further buy in or investing
            before distributing the fund.
          </p>
          {payoutProgress === 'not started' ? (
            <p>
              Please confirm the following before closing the club and
              distributing the fund.
            </p>
          ) : payoutProgress === 'in progress' && (
            <p className="bg-red-100 py-1 px-2 rounded-[4px] font-semibold text-error w-fit">
              Do not close this window
            </p>
          )}
        </div>
        {/* Split breakdown */}
        <div className="overflow-y-scroll md:w-1/2 grow">
          {payoutProgress === 'not started' ? (
            <>
              <p className="mb-2 text-sm font-bold uppercase text-secondary-600">
                Split breakdown
              </p>
              {/* For each member, show an ownership item */}
              <OwnershipItem />
              <OwnershipItem />
              <OwnershipItem />
              <OwnershipItem />
            </>
          ) : (
            <PayoutProgressLine />
          )}
        </div>
      </div>
      {/* Button group */}
      <div className="flex flex-col items-center gap-3 bg-secondary-100">
        {payoutProgress === 'not started' ? (<>
        <p className="bg-red-100 py-1 px-2 rounded-[4px] font-semibold text-error">
          Closing the club is irreversible
        </p>
        <Button className="!bg-error !border-none w-[312px] hover:!bg-red-600 active:!bg-red-700" onClick={() => setPayoutProgress('in progress')}>
          <h5>Close club and distribute</h5>
        </Button>
        <Button
          variant="secondary-outline"
          className="w-[312px]"
          onClick={() => router.push(`/clubs/${id}`)}
        >
          <h5>Go back</h5>
        </Button>
        </>) : payoutProgress === 'done' && <Button className="w-[218px]"><h3>Back to my clubs</h3></Button>}
        
      </div>
    </div>
  );
};

CloseClub.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default CloseClub;
