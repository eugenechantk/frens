import type { NextPage } from "next";
import Head from "next/head";
import { Button } from "../components/Button/Button";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>frens</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col justify-center px-20">
        <h1 className="text-6xl font-bold text-primary-600 mb-8">
          Welcome to frens
        </h1>
        <Button onClick={() => router.push('/clubs')}>
          <h3>Get started</h3>
        </Button>
      </main>
    </div>
  );
};

export default Home;
