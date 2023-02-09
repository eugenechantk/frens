import type { InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { Button } from "../components/Button/Button";
import { useRouter } from "next/router";
import Link from "next/link";
import Cards from "../public/Cards.png";
import Coin3d from "../public/Coin_3d.png";
import QuoteGreen from "../public/Quote_Green.png";
import QuoteOrange from "../public/Quote_Orange.png";
import QuoteYellow from "../public/Quote_Yellow.png";
import Camera3d from "../public/Camera_3d.png";
import Card3d from "../public/Card_3d.png";
import MockUpLaptop from "../public/Mockup_Laptop.png";
import MockUpPhone from "../public/Mockup_Phone.png";
import logoSrc from "../public/logo.png";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import nookies from "nookies";

export const getServerSideProps = async (context: any) => {
  // Step 0: get auth status of the user
  const cookies = nookies.get(context);
  if (cookies.token) {
    return {
      redirect: {
        destination: "/clubs",
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}

const Home: NextPage = ({...serverProps}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>frens - Invest digital assets with your friends</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-full w-full flex flex-col">
        {/* Navbar */}
        <div className="w-full min-h-[76px] relative z-50">
          <div className="absolute flex flex-row gap-2 top-[calc(50%-40px/2)] left-4 items-center">
            <Image src={logoSrc} alt="frens Logo" height={40} width={40} />
            <h3 className="text-primary-600 tracking-tight">frens</h3>
          </div>
          <Link
            href="/clubs"
            className="absolute top-[calc(50%-38px/2)] right-4"
          >
            <Button variant="secondary" className="px-4 h-10">
              <h5 className="leading-4">Get started</h5>
              <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <main className="grow w-full">
          {/* Hero section */}
          <div className="h-[375px] md:max-w-[609px] w-full relative mx-auto mt-6 md:mt-10 mb-5 overflow-hidden">
            <Image
              src={Cards}
              alt="Digital assets"
              height={375}
              className="mx-auto"
            />
            <Image
              src={QuoteYellow}
              alt="quote"
              height={107}
              className="absolute top-0 right-[calc(50%+100px)]"
            />
            <Image
              src={QuoteOrange}
              alt="quote"
              height={134}
              className="absolute top-[188px] right-[calc(50%+112px)]"
            />
            <Image
              src={QuoteGreen}
              alt="quote"
              height={107}
              className="absolute top-[126px] left-[calc(50%+118px)]"
            />
          </div>
          {/* Tagline and main CTA */}
          <div className="px-4 flex flex-col gap-4 items-center">
            <div className="flex flex-col gap-1">
              <h2 className=" text-center">Build wealth together</h2>
              <p className=" text-center">
                Invest in digital assets together with your friends, or anyone.{" "}
              </p>
            </div>
            <Link href="/clubs" className="w-[200px]">
              <Button className="w-full">
                <h5>Start or join a club</h5>
              </Button>
            </Link>
          </div>
          {/* Use case section */}
          <div className="mt-16 px-4 flex flex-col gap-6 items-center lg:mt-20">
            <h3 className="w-[270px] md:w-auto text-center leading-6">
              Start an investment club for...
            </h3>
            <div className="flex flex-col gap-3 w-full h-[680px] md:h-[224px] md:flex-row md:max-w-[1000px]">
              {/* Use case card */}
              <div className="bg-white flex flex-col justify-between p-6 rounded-20 w-full grow">
                <Image src={Coin3d} alt="coin" height={58} />
                <div className="flex flex-col gap-1">
                  <h4>Crypto fund</h4>
                  <p>Form a hedge fund and profit from co-investing</p>
                </div>
              </div>
              {/* Use case card */}
              <div className="bg-white flex flex-col justify-between p-6 rounded-20 w-full grow">
                <Image src={Camera3d} alt="coin" height={58} />
                <div className="flex flex-col gap-1">
                  <h4>Buy NFTs</h4>
                  <p>
                    Raise funds from your friends to buy a rare art piece, or a
                    few
                  </p>
                </div>
              </div>
              {/* Use case card */}
              <div className="bg-white flex flex-col justify-between p-6 rounded-20 w-full grow">
                <Image src={Card3d} alt="coin" height={58} />
                <div className="flex flex-col gap-1">
                  <h4>Community treasury</h4>
                  <p>Use investment clubs to hold community fund securely</p>
                </div>
              </div>
            </div>
          </div>
          {/* End card */}
          <div className="w-full mt-16 lg:mt-20">
            {/* End tagline */}
            <div className="px-4 flex flex-col gap-4 items-center">
              <div className="flex flex-col gap-1 items-center">
                <h3>Invest together like starting a group chat</h3>
                <p className="text-center">
                  Create an investment club as easy as creating a WhatsApp group
                </p>
              </div>
              <Link href="/clubs" className="w-60">
                <Button className="w-full">
                  <h5>Start your club</h5>
                </Button>
              </Link>
            </div>
            {/* Mockups */}
            <div className="w-full h-[371px] lg:h-[504px] overflow-hidden relative">
              <Image
                src={MockUpPhone}
                alt="mockup"
                height={432}
                className="absolute top-10 left-[calc(50%-102px)] mx-auto lg:hidden"
              />
              <Image
                src={MockUpLaptop}
                alt="mockup"
                height={637}
                className="absolute top-10 left-[calc(50%-420px)] mx-auto hidden lg:block"
              />
              <div className="w-full h-[calc(30%)] absolute left-0 top-[70%] bg-gradient-to-b from-white/0 to-secondary-100"></div>
            </div>
          </div>
          {/* Copyright */}
          <div className="mt-14 mb-10 flex flex-col gap-1 items-center">
            <Image
              src={logoSrc}
              alt="logo"
              height={24}
              className=" opacity-40"
            />
            <p className="text-sm text-secondary-400">
              All rights reserved © frens
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
