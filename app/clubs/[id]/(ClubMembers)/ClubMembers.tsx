import React from "react";
import { fetchMemberInfo } from "../../../../lib/fetchers";
import { IMemberInfoData } from "../../../../lib/types/club";
import ClubMemberAvatar from "./ClubMemberAvatar";

async function getClubMember (id: string) {
  let memberInfo = [] as IMemberInfoData[];
  try {
    memberInfo = await fetchMemberInfo(id);
  } catch (err) {
    console.log(err);
  }
  return memberInfo
}

export default async function ClubMembers({id}: {id: string}) {
  const memberInfo = await getClubMember(id);
  console.log(memberInfo);
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <div className="flex flex-row">
        {memberInfo.map((member, index) => 
          <ClubMemberAvatar index={index} profileImage={member.profile_image} uid={member.uid}/>
        )}
      </div>
    </div>
  );
}
