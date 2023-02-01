import { InferGetServerSidePropsType } from "next"
import { ReactElement } from "react"
import AppLayout from "../../../layout/AppLayout"
import { NextPageWithLayout } from "../../_app"

export const getServerSideProps = async (context: any) => {
  
  return {
    props: {

    }
  }
}

const CloseClub: NextPageWithLayout<any> = ({
  ...serverProps
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>Closing club</>
  )
}

CloseClub.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default CloseClub;