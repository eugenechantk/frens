import { adminFirestore } from "../firebase/firebaseAdmin";

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
  closed?:boolean
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