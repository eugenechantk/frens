import React, { lazy, ReactElement } from "react";
import AppLayout from "../../../layout/AppLayout";
import { NextPageWithLayout } from "../../_app";
import {
  adminAuth,
  adminFirestore,
} from "../../../firebase/firebaseAdmin";
import { InferGetServerSidePropsType } from "next";
import ClubDetails from "../../../components/ClubDetails/ClubDetails";
import ClubMembers from "../../../components/ClubMembers/ClubMembers";
import ClubBalance from "../../../components/ClubBalance/ClubBalance";
import Portfolio from "../../../components/Portfolio/Portfolio";
import WidgetSection from "../../../components/Widgets/WidgetSection";
import { getChainData } from "../../../lib/chains";
import axios from "axios";
import _ from "lodash";
import nookies from "nookies";
import NotAuthed from "../../../components/NotAuthed/NotAuthed";
import {
  getUsdPrice,
  verifyClubHolding,
} from "../../../lib/ethereum";
import NotVerified from "../../../components/NotVerified/NotVerified";
import { ethers } from "ethers";
import Splitting from "../../../components/Splitting/Splitting";
const TradeAsset = lazy(() => import("../../../components/Widgets/TradeAsset"));

export interface IClubInfo {
  club_description: string;
  club_image?: string;
  club_name: string;
  club_token_sym: string;
  club_wallet_address?: string;
  club_wallet_mnemonic?: string;
  club_token_address?: string;
  deposited?: boolean;
  club_members?: { [k: string]: number };
  last_retrieved_block?: number;
}

export type THoldingsData = {
  token_address: string;
  name: string;
  symbol: string;
  logo: string | null;
  thumbnail: string | null;
  decimals: number;
  balance: string;
  value?: number;
};

export interface IMemberInfoData {
  display_name: string;
  profile_image: string;
  uid: string;
}

interface ITransferEvent {
  transaction_hash: string;
  address: string;
  block_timestamp: string;
  block_number: string;
  block_hash: string;
  to_address: string;
  from_address: string;
  value: string;
  transaction_index: number;
  log_index: number;
}

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  const cookies = nookies.get(context);
  // console.log(cookies)
  // console.log(id);

  // Fetch function for club information
  const fetchClubInfo = async (id: string) => {
    try {
      const _clubInfo = await adminFirestore
        .collection("clubs")
        .doc(id)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            throw new Error("club does not exist in database");
          }
          return doc.data() as IClubInfo;
        })
        .then((data) => {
          return { ...data };
        });
      return _clubInfo;
    } catch (err) {
      throw err;
    }
  };

  // Fetcher function for club portfolio
  const fetchPortfolio = async (address: string) => {
    let balances = [] as THoldingsData[];
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
            data.forEach((tokenBalance) => balances.push(tokenBalance))
          );
      };
      const nativeBalance = async () => {
        const _nativeBalance = await axios
          .request(nativeOptions)
          .then((response) => {
            return response.data.balance;
          });
        balances.push({
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
      return balances;
    } catch (err) {
      throw err;
    }
  };

  const fetchMemberInfo = async (clubInfo: IClubInfo): Promise<IMemberInfoData[]> => {
    // STEP 1: Fetch the last updated club member list
    let _club_members: { [k: string]: number };
    if (clubInfo.club_members) {
      _club_members = clubInfo.club_members;
    } else {
      _club_members = {
        "0x0000000000000000000000000000000000000000": 0,
      };
    }

    // STEP 2: Get the transfer events ellapsed from last time the club is retrieved
    const rpcUrl = getChainData(
      parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!)
    ).rpc_url;
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const currentBlock = await provider
      .getBlockNumber();
    // console.log(`Querying transactions from ${clubInfo.last_retrieved_block} to ${currentBlock}`);
    const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_KEY;
    const options = {
      method: "GET",
      url: "https://deep-index.moralis.io/api/v2/erc20/%address%/transfers".replace(
        "%address%",
        clubInfo.club_token_address!
      ),
      params: {
        chain: getChainData(parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!))
          .network,
        from_block:
          clubInfo.last_retrieved_block && clubInfo.last_retrieved_block,
        to_block: currentBlock,
      },
      headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
    };

    // STEP 3: Update the club member list based on new transfer events
    const transferEvents = await axios
      .request(options)
      .then((response) => response.data)
      .then((data) => data.result);
    // console.log(transferEvents);
    transferEvents.forEach((event: ITransferEvent) => {
      // Create a new member object if the existing club member object does not have the addresses
      if (!(event.from_address in _club_members)) {
        _club_members[event.from_address] = 0;
      }
      if (!(event.to_address in _club_members)) {
        _club_members[event.to_address] = 0;
      }
      // Update the balance of each club member
      _club_members[event.from_address] -= parseInt(event.value);
      _club_members[event.to_address] += parseInt(event.value);
    });
    // Purge all addresses with <=0 balance
    _club_members = _.pickBy(_club_members, function (value) {
      return value > 0;
    });
    // console.log('New club member list: ', _club_members)

    // STEP 4: Replace existing club members with updated club members list
    const result = await adminFirestore.collection("clubs").doc(id).update({
      club_members: _club_members,
      last_retrieved_block: currentBlock,
    });

    // STEP 5: Fetch club members info
    let memberInfo = [] as IMemberInfoData[];
    await Promise.all(
      Object.keys(_club_members).map(async (uid) => {
        // console.log(uid)
        const _memberInfo = await adminAuth.getUser(uid);
        memberInfo.push({
          display_name: _memberInfo.displayName!,
          profile_image: _memberInfo.photoURL!,
          uid: _memberInfo.uid,
        });
      })
    );
    return memberInfo
  };

  if (!cookies.token) {
    return {
      props: {
        error: "Not authed",
      },
    };
  } else {
    try {
      // Prereq: get user address and club info
      const userAddress = await adminAuth
        .verifyIdToken(cookies.token)
        .then((decodedToken) => decodedToken.uid);
      // console.log(userAddress)
      // Step 1: Get club information
      const clubInfo: IClubInfo = await fetchClubInfo(id);

      // Step 2: Check if the user has club tokens to access this club
      const verify = await verifyClubHolding(
        userAddress,
        clubInfo.club_token_address!
      );
      // console.log(verify)
      if (!verify) {
        throw Error("Not verified");
      }

      // Step 3: Fetch porfolio of the club
      const balance: THoldingsData[] = await fetchPortfolio(
        clubInfo.club_wallet_address!
      );

      // Step 4: fetch club members
      let memberInfo = [] as IMemberInfoData[]
      try {
        memberInfo = await fetchMemberInfo(clubInfo);
      } catch (err) {
        console.log(err)
      }

      return {
        props: {
          clubInfo: clubInfo,
          balance: balance,
          members: memberInfo,
        },
      };
    } catch (err) {
      console.log(err);
      return {
        props: {
          error: JSON.parse(JSON.stringify(err)),
        },
      };
    }
  }
};

const Dashboard: NextPageWithLayout<any> = ({
  ...serverProps
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      {!serverProps.error ? (
        <div className="md:max-w-[1000px] w-full md:mx-auto px-4 pt-3 md:pt-12 pb-5 h-full md:flex md:flex-row md:items-start md:gap-6 flex flex-col gap-8">
          {/* Left panel */}
          <div className="flex flex-col items-start gap-8 w-full">
            {/* Club details and members */}
            <div className="flex flex-col items-start gap-4 w-full">
              <ClubDetails data={serverProps.clubInfo!} />
              <ClubMembers data={serverProps.members!} />
            </div>
            {/* Balance */}
            {/* TODO: have a global state setting for whether to show club or me balance */}
            <ClubBalance />
            {/* Portfolio */}
            <Portfolio data={serverProps.balance!} clubWalletAddress={serverProps.clubInfo?.club_wallet_address!}/>
          </div>
          {/* Right panel */}
          <WidgetSection data={serverProps.clubInfo!}/>
          {/* FOR TESTING SPLITTING */}
          <Splitting data={serverProps.clubInfo!} />
        </div>
      ) : serverProps.error === "Not authed" ? (
        <NotAuthed />
      ) : (
        <NotVerified />
      )}
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Dashboard;
