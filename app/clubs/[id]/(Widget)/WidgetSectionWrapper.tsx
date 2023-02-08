import React from 'react'
import BuyInWidgetWrapper from '../../../../components/Widgets/BuyInWidget/BuyInWidgetWrapper';
import WidgetSection from '../../../../components/Widgets/WidgetSection';
import { fetchClubInfo, IClubInfo } from '../../../../lib/fetchers';

async function getClubInfo (id: string) {
  const clubInfo: IClubInfo = await fetchClubInfo(id);
  return clubInfo
}

export default async function WidgetSectionWrapper({id, verify}: {id:string, verify: boolean}) {
  const clubInfo = await getClubInfo(id);
  console.log(verify, typeof verify)
  return (
    <>
      {verify ? <WidgetSection data={clubInfo} id={id}/> : <BuyInWidgetWrapper data={clubInfo} verify={verify}/>}
    </>
  )
}
