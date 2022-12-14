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
import { getChainData } from "../../../lib/chains";
import axios from "axios";
import _ from "lodash";
const TradeAsset = lazy(() => import("../../../components/Widgets/TradeAsset"));

export type TClubInfo = {
  club_description: string;
  club_image: string;
  club_name: string;
  club_token_sym?: string;
  club_wallet_address: string;
  club_wallet_mnemonic?: string;
  deposited?: boolean;
  club_members: string[];
};

export type THoldingsData = {
  token_address: string;
  name: string;
  symbol: string;
  logo: string | null;
  thumbnail: string | null;
  decimals: number;
  balance: string;
};

export type TMemberInfoData = {
  display_name: string;
  profile_image: string;
  uid: string;
};

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  console.log(id);

  // Fetch function for club information
  const fetchClubInfo = async (id: string) => {
    try {
      const _clubInfo = await firebaseAdmin
        .firestore()
        .collection("clubs")
        .doc(id)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            throw new Error("club does not exist in database");
          }
          return doc.data() as TClubInfo;
        })
        .then((data) => {
          const {
            club_name,
            club_description,
            club_image,
            club_members,
            club_wallet_address,
          } = data!;
          return {
            club_name,
            club_description,
            club_image,
            club_members,
            club_wallet_address,
          };
        });
      return _clubInfo;
    } catch (err) {
      throw err;
    }
  };

  // Fetch function for member info
  const fetchMemberInfo = async (members: string[]) => {
    let memberInfo = [] as TMemberInfoData[];
    await Promise.all(
      members.map(async (id) => {
        const _memberInfo = await firebaseAdmin.auth().getUser(id);
        memberInfo.push({
          display_name: _memberInfo.displayName!,
          profile_image: _memberInfo.photoURL!,
          uid: _memberInfo.uid
        });
      })
    );
    return memberInfo;
  };

  // Fetcher function for club members
  const fetchPortfolio = async (address: string) => {
    let balance = [] as THoldingsData[];
    const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_KEY;
    const tokensOptions = {
      method: "GET",
      url: "https://deep-index.moralis.io/api/v2/%address%/erc20".replace(
        "%address%",
        address
      ),
      params: {
        chain: getChainData(parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!))
          .network,
      },
      headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
    };

    const nativeOptions = {
      method: "GET",
      url: "https://deep-index.moralis.io/api/v2/%address%/balance".replace(
        "%address%",
        address
      ),
      params: {
        chain: getChainData(parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!))
          .network,
      },
      headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
    };

    try {
      const erc20TokenBalance = async () => {
        await axios
          .request(tokensOptions)
          .then((response) => {
            return response.data;
          })
          .then((data: []) =>
            data.forEach((tokenBalance) => balance.push(tokenBalance))
          );
      };
      const nativeBalance = async () => {
        const _nativeBalance = await axios
          .request(nativeOptions)
          .then((response) => {
            return response.data.balance;
          });
        balance.push({
          token_address: "",
          name: "Ethereum",
          symbol: "ETH",
          logo: null,
          thumbnail: null,
          decimals: 18,
          balance: String(_nativeBalance),
        });
      };
      await Promise.all([erc20TokenBalance(), nativeBalance()]);
      return balance;
    } catch (err) {
      throw err;
    }
  };

  try {
    const clubInfo: TClubInfo = await fetchClubInfo(id);
    const balance: THoldingsData[] = await fetchPortfolio(
      clubInfo.club_wallet_address
    );
    const memberInfo: TMemberInfoData[] = await fetchMemberInfo(
      clubInfo.club_members
    );
    return {
      props: {
        clubInfo: {
          ...clubInfo,
        },
        balance: balance,
        members: memberInfo,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
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
          <ClubDetails data={serverProps.clubInfo} />
          <ClubMembers data={serverProps.members} />
        </div>
        {/* Balance */}
        {/* TODO: have a global state setting for whether to show club or me balance */}
        <ClubBalance />
        {/* Portfolio */}
        <Portfolio data={serverProps.balance}/>
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
