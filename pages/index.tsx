import type { NextPage } from "next";
import Head from "next/head";
import { Button } from "../components/Button/Button";
import { useRouter } from "next/router";
import Link from "next/link";
import Cards from "../public/Cards.png"
import Coin3d from "../public/Coin_3d.png"
import QuoteGreen from "../public/Quote_Green.png"
import QuoteOrange from "../public/Quote_Orange.png"
import QuoteYellow from "../public/Quote_Yellow.png"
import Camera3d from "../public/Camera_3d.png"
import Card3d from "../public/Card_3d.png"
import MockUpLaptop from "../public/Mockup_Laptop.png"
import Image from "next/image";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>frens</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image src={Cards} alt="cards"/>
      <Image src={Coin3d} alt='coin3d'/>
      <Image src={QuoteGreen} alt='quoteGreen'/>
      <Image src={QuoteOrange} alt='quoteOrange'/>
      <Image src={QuoteYellow} alt='quoteYellow'/>
      <Image src={Camera3d} alt='camera3d'/>
      <Image src={Card3d} alt='card3d'/>
      <Image src={MockUpLaptop} alt='mockUpLaptio'/>
      <main className="flex w-full flex-1 flex-col justify-center px-20">
        <Link href="/clubs" className="w-[212px]">
          <Button className="w-full">
            <h3>Get started</h3>
          </Button>
        </Link>
      </main>
    </div>
  );
};

export default Home;
