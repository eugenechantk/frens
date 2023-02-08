import { adminAuth, adminFirestore } from "../firebase/firebaseAdmin";
import { getClubMemberBalance, getLatestBlockNumber } from "./ethereum";
import { IMemberInfoData } from "./types/club";

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
  split_contract_address?: string;
}

// Fetch function for club information
export const fetchClubInfo = async (id: string) => {
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

export const fetchMemberInfo = async (
  id: string
): Promise<IMemberInfoData[]> => {
  const clubInfo: IClubInfo = await fetchClubInfo(id);
  console.log(clubInfo)
  // STEP 1: Fetch the latest club member list
  const _club_members = await getClubMemberBalance(clubInfo, id);
  console.log(_club_members)
  // STEP 2: Update the club member list
  const currentBlock = await getLatestBlockNumber();
  const result = adminFirestore.collection("clubs").doc(id).update({
    club_members: _club_members,
    last_retrieved_block: currentBlock,
  });

  // STEP 3: Fetch club members info by the updated club member list
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
  console.log(memberInfo)
  return memberInfo;
};